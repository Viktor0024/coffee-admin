"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Order } from "@/lib/types";
import { BOARD_COLUMNS, type OrderStatus } from "@/lib/orders-constants";
import { KanbanColumn } from "./kanban-column";
import { updateOrderStatus } from "./actions";
import styles from "./orders.module.css";

const BOARD_STATUSES: OrderStatus[] = ["new", "in_progress", "ready", "completed"];

const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  accepted: "in_progress",
  preparing: "in_progress",
};

function normalizeStatus(status: string): OrderStatus {
  return (LEGACY_STATUS_MAP[status] ?? status) as OrderStatus;
}

function ordersByStatus(orders: Order[]): Record<OrderStatus, Order[]> {
  const map: Record<string, Order[]> = {
    new: [],
    in_progress: [],
    ready: [],
    completed: [],
  };
  for (const order of orders) {
    const s = normalizeStatus(order.status);
    if (BOARD_STATUSES.includes(s)) {
      map[s].push({ ...order, status: s });
    }
  }
  for (const key of BOARD_STATUSES) {
    map[key].sort((a, b) => {
      const aTime = (a.updated_at || a.created_at);
      const bTime = (b.updated_at || b.created_at);
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }
  return map as Record<OrderStatus, Order[]>;
}

export function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    const { data, err } = await supabase
      .from("orders")
      .select("id, items, total, status, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (err) {
      setError(err.message);
      setOrders([]);
      return;
    }
    setOrders((data ?? []) as Order[]);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase не налаштовано. Задайте NEXT_PUBLIC_SUPABASE_URL та NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local"
      );
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, [fetchOrders]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel("orders-kanban-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  /** Сразу переносим заказ в новую колонку на самый верх (оптимистично) */
  const moveOrderToTop = useCallback((orderId: string, newStatus: OrderStatus) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, updated_at: now } : o
      )
    );
    fetchOrders();
  }, [fetchOrders]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent, newStatus: OrderStatus) => {
      e.preventDefault();
      const orderId = e.dataTransfer.getData("application/order-id");
      if (!orderId) return;
      const { error } = await updateOrderStatus(orderId, newStatus);
      if (!error) moveOrderToTop(orderId, newStatus);
    },
    [moveOrderToTop]
  );

  if (!isSupabaseConfigured()) {
    return <div className={styles.ordersError}>{error}</div>;
  }

  if (loading) {
    return <p className={styles.ordersEmpty}>Завантаження замовлень…</p>;
  }

  if (error) {
    return (
      <>
        <div className={styles.ordersError}>{error}</div>
        <button type="button" onClick={() => fetchOrders()} className={styles.retryButton}>
          Повторити
        </button>
      </>
    );
  }

  const byStatus = ordersByStatus(orders);

  return (
    <div className={styles.kanbanBoard}>
      {BOARD_COLUMNS.map(({ status, title }) => (
        <KanbanColumn
          key={status}
          status={status}
          title={title}
          orders={byStatus[status]}
          onOrderMoved={moveOrderToTop}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
