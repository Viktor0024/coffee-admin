import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { getSupabaseClient, isSupabaseConfigured } from "@/services/supabase";
import { useOrders } from "@/context/orders-context";

export function useOrderStatusRealtime() {
  const { orders, updateOrderStatus } = useOrders();
  const orderIdsRef = useRef<Set<string>>(new Set());
  const updateRef = useRef(updateOrderStatus);

  orderIdsRef.current = new Set(orders.map((o) => o.orderId));
  updateRef.current = updateOrderStatus;

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();
    const channel = supabase
      .channel("order-status-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload: { new?: { id?: string; status?: string } }) => {
          const id = payload.new?.id;
          const status = payload.new?.status;
          if (!id || status == null) return;
          if (!orderIdsRef.current.has(id)) return;

          updateRef.current(id, status);
          // Сповіщення лише коли замовлення готове
          if (status === "ready") {
            Alert.alert(
              "Замовлення готове",
              "Можете забрати.",
              [{ text: "OK" }]
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
