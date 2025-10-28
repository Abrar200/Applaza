import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coins: number;
}

interface MobileAppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: any[];
  addToCart: (item: any) => void;
  wishlist: any[];
  addToWishlist: (item: any) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const MobileAppContext = createContext<MobileAppContextType | undefined>(undefined);

export const MobileAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  const login = async (email: string, password: string) => {
    // Mock login
    setUser({
      id: '1',
      name: 'Harrison Liam',
      email: email,
      avatar: 'https://d64gsuwffb70l.cloudfront.net/685afce20bfda24fc0f1d36c_1761584250437_49763d88.png',
      coins: 105
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  const addToWishlist = (item: any) => {
    setWishlist([...wishlist, item]);
  };

  return (
    <MobileAppContext.Provider value={{
      user,
      setUser,
      cart,
      addToCart,
      wishlist,
      addToWishlist,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </MobileAppContext.Provider>
  );
};

export const useMobileApp = () => {
  const context = useContext(MobileAppContext);
  if (!context) throw new Error('useMobileApp must be used within MobileAppProvider');
  return context;
};
