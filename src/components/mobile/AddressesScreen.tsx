import { ChevronLeft, Home, Briefcase, MapPin, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const addresses = [
  { id: 1, label: 'Home', address: 'Address line goes here', icon: Home },
  { id: 2, label: 'Work', address: 'Address line goes here', icon: Briefcase },
  { id: 3, label: "Lachlan's", address: 'Address line goes here', icon: MapPin }
];

export const AddressesScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
      </div>

      <div className="p-6 space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <addr.icon className="w-6 h-6 text-gray-700" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{addr.label}</h3>
              <p className="text-gray-500">{addr.address}</p>
            </div>

            <button className="p-2">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        ))}

        <Button className="w-full bg-white hover:bg-gray-50 text-black border-2 border-dashed border-gray-300 rounded-2xl h-16 text-lg">
          <Plus className="w-6 h-6 mr-2" />
          Add New Address
        </Button>
      </div>
    </div>
  );
};
