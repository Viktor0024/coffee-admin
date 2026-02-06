import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Order } from "@/data/order";

type OrdersContextValue = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = "coffee.orders.v1";

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && isActive) {
          setOrders(parsed as Order[]);
        }
      } catch {
        if (isActive) {
          setOrders([]);
        }
      } finally {
        if (isActive) {
          setIsHydrated(true);
        }
      }
    };

    loadOrders();
    return () => {
      isActive = false;
    };
  }, []);

  const addOrder = (order: Order) => {
    setOrders((current) => [order, ...current]);
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders((current) =>
      current.map((o) =>
        o.orderId === orderId ? { ...o, status } : o
      )
    );
  };

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders)).catch(() => {});
  }, [orders, isHydrated]);

  const value = useMemo(
    () => ({ orders, addOrder, updateOrderStatus }),
    [orders]
  );

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return context;
}
