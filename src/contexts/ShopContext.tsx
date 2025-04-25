'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ShopContextType {
  cartItems: CartItem[];
  favorites: string[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isInCart: (productId: string) => boolean;
  isInFavorites: (productId: string) => boolean;
  cartItemsCount: number;
  favoritesCount: number;
  promocode: string | null;
  discount: number;
  applyPromocode: (code: string) => Promise<void>;
  clearPromocode: () => void;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  userId: string;
}

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promocode, setPromocode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (session?.user?.id) {
        try {
          await Promise.all([fetchCartItems(), fetchFavorites()]);
        } catch (error) {
          console.error('Error loading shop data:', error);
        }
      } else {
        setCartItems([]);
        setFavorites([]);
      }
      setIsLoading(false);
    };

    if (status !== 'loading') {
      loadData();
    }
  }, [session, status]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (response.ok) {
        setCartItems(data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.map((item: any) => item.productId));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    }
  };

  const addToCart = async (productId: string) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      console.log('Adding to cart:', productId, 'Session:', session.user);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'same-origin',
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      await fetchCartItems();
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      console.log('Removing from cart:', productId);
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'same-origin',
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove from cart');
      }

      if (session.user.id === 'admin') {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
      } else {
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      console.log('Updating cart item quantity:', { productId, quantity });
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        credentials: 'same-origin',
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart item');
      }

      if (session.user.id === 'admin') {
        setCartItems(prev => prev.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        ));
      } else {
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      console.log('Toggling favorite:', productId, 'Session:', session.user);
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'same-origin',
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle favorite');
      }

      await fetchFavorites();
      return data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const isInCart = (productId: string) => 
    cartItems.some(item => item.productId === productId);

  const isInFavorites = (productId: string) => 
    favorites.includes(productId);

  const cartItemsCount = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
    
  const favoritesCount = Array.isArray(favorites) 
    ? favorites.length 
    : 0;

  const applyPromocode = async (code: string) => {
    try {
      const response = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to apply promocode');
      }

      setPromocode(code);
      setDiscount(data.discount);
      return data;
    } catch (error) {
      console.error('Error applying promocode:', error);
      throw error;
    }
  };

  const clearPromocode = () => {
    setPromocode(null);
    setDiscount(0);
  };

  if (isLoading) {
    return null;
  }

  return (
    <ShopContext.Provider value={{
      cartItems,
      favorites,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      toggleFavorite,
      isInCart,
      isInFavorites,
      cartItemsCount,
      favoritesCount,
      promocode,
      discount,
      applyPromocode,
      clearPromocode,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
} 