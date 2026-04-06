import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Call Stripe REST API directly — no SDK import, avoids Deno EarlyDrop crashes
async function stripeRequest(path: string, method: string, body?: Record<string, unknown>) {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? encodeFormData(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `Stripe error: ${res.status}`)
  return data
}

function encodeFormData(obj: Record<string, unknown>, prefix = ''): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        parts.push(encodeFormData(value as Record<string, unknown>, fullKey))
      } else {
        parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`)
      }
    }
  }
  return parts.join('&')
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // ── Authenticate user ─────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization') ?? ''
    const jwt = authHeader.replace('Bearer ', '')

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
      auth: { persistSession: false },
    })

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError?.message)
      return new Response(JSON.stringify({ error: 'Unauthorized', detail: userError?.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Authenticated:', user.id, user.email)

    // ── Get brand via service role (bypasses RLS) ─────────────────────────
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })

    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      console.error('Brand not found:', brandError?.message)
      return new Response(JSON.stringify({
        error: 'Brand not found. Please complete sign up first.',
        detail: brandError?.message,
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Brand found:', brand.id, brand.name)

    const { action } = await req.json()
    console.log('Action:', action)

    // ── create_account ────────────────────────────────────────────────────
    if (action === 'create_account') {
      let stripeAccountId = brand.stripe_account_id

      if (!stripeAccountId) {
        console.log('Creating Stripe Express account...')
        const account = await stripeRequest('/accounts', 'POST', {
          type: 'express',
          email: user.email!,
          'capabilities[card_payments][requested]': 'true',
          'capabilities[transfers][requested]': 'true',
          'metadata[brand_id]': brand.id,
          'metadata[user_id]': user.id,
        })
        stripeAccountId = account.id
        console.log('Stripe account created:', stripeAccountId)

        await supabaseAdmin
          .from('brands')
          .update({ stripe_account_id: stripeAccountId })
          .eq('id', brand.id)
      }

      const origin = req.headers.get('origin') ?? 'http://localhost:8080'
      const accountLink = await stripeRequest('/account_links', 'POST', {
        account: stripeAccountId,
        refresh_url: `${origin}/vendor/stripe-refresh`,
        return_url: `${origin}/vendor/stripe-return`,
        type: 'account_onboarding',
      })

      console.log('Account link created:', accountLink.url)
      return new Response(JSON.stringify({ url: accountLink.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── check_status ──────────────────────────────────────────────────────
    if (action === 'check_status') {
      if (!brand.stripe_account_id) {
        return new Response(JSON.stringify({ complete: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const account = await stripeRequest(`/accounts/${brand.stripe_account_id}`, 'GET')
      const complete = account.details_submitted && account.charges_enabled

      if (complete) {
        await supabaseAdmin
          .from('brands')
          .update({ stripe_onboarding_complete: true })
          .eq('id', brand.id)
      }

      return new Response(JSON.stringify({ complete }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Function error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})