import { createContext, useContext, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: Record<string, CartItem>;
  addItem: (item: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  removeItemCompletely: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, CartItem>>({});

  const addItem = (item: { id: string; name: string; price: number }) => {
    setItems((current) => {
      const existing = current[item.id];
      if (existing) {
        return {
          ...current,
          [item.id]: { ...existing, quantity: existing.quantity + 1 },
        };
      }
      return {
        ...current,
        [item.id]: { ...item, quantity: 1 },
      };
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const existing = current[id];
      if (!existing) return current;
      if (existing.quantity <= 1) {
        const { [id]: _, ...rest } = current;
        return rest;
      }
      return {
        ...current,
        [id]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  const removeItemCompletely = (id: string) => {
    setItems((current) => {
      if (!current[id]) return current;
      const { [id]: _, ...rest } = current;
      return rest;
    });
  };

  const clearCart = () => setItems({});

  const { totalItems, totalPrice } = useMemo(() => {
    const entries = Object.values(items);
    const totalCount = entries.reduce((sum, item) => sum + item.quantity, 0);
    const totalCost = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems: totalCount, totalPrice: totalCost };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      removeItemCompletely,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, removeItem, removeItemCompletely, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
