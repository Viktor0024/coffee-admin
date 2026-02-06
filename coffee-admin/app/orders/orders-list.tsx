"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { getPublicStorageUrl } from "@/lib/storage";
import type { Order } from "@/lib/types";
import { AcceptOrderButton } from "./accept-order-button";
import styles from "./orders.module.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: "Новий",
    accepted: "Прийнято",
    completed: "Завершено",
    preparing: "Готується",
    ready: "Готовий",
  };
  return labels[status] ?? status;
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    new: styles.orderStatusNew,
    accepted: styles.orderStatusAccepted,
    completed: styles.orderStatusCompleted,
    preparing: styles.orderStatusPreparing,
    ready: styles.orderStatusReady,
  };
  return map[status] ?? "";
}

function OrderItemImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={styles.orderItemPlaceholder} aria-hidden />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={styles.orderItemImage}
      width={56}
      height={56}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefreshTrigger((t) => t + 1);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase не налаштовано. Задайте в .env.local змінні NEXT_PUBLIC_SUPABASE_URL та NEXT_PUBLIC_SUPABASE_ANON_KEY (Dashboard → Project Settings → API)."
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    const isInitial = refreshTrigger === 0;
    if (isInitial) {
      setLoading(true);
      setError(null);
    }

    (async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("orders")
          .select("id, items, total, status, created_at")
          .order("created_at", { ascending: false });

        if (cancelled) return;
        if (error) {
          setError(error.message);
          setOrders([]);
          return;
        }
        setOrders((data ?? []) as Order[]);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Не вдалося завантажити замовлення");
        setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          setRefreshTrigger((t) => t + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className={styles.ordersError}>
        {error}
      </div>
    );
  }

  if (loading) {
    return <p className={styles.ordersEmpty}>Завантаження замовлень…</p>;
  }

  if (error) {
    return (
      <>
        <div className={styles.ordersError}>{error}</div>
        <p className={styles.ordersEmpty}>Перевірте .env.local та перезапустіть dev-сервер.</p>
      </>
    );
  }

  if (orders.length === 0) {
    return <p className={styles.ordersEmpty}>Поки немає замовлень.</p>;
  }

  return (
    <section className={styles.ordersGrid}>
      {orders.map((order) => (
        <article key={order.id} className={styles.orderCard}>
          <header className={styles.orderCardHeader}>
            <time className={styles.orderDate} dateTime={order.created_at}>
              {formatDate(order.created_at)}
            </time>
            <span className={`${styles.orderStatus} ${statusClass(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </header>

          <ul className={styles.orderItemsList} role="list">
            {order.items.map((item) => {
              const imageSrc = getPublicStorageUrl(item.image_url);
              return (
              <li
                key={`${order.id}-${item.id}-${item.quantity}`}
                className={styles.orderItemRow}
              >
                <div className={styles.orderItemMedia}>
                  {imageSrc ? (
                    <OrderItemImage src={imageSrc} alt={item.name} />
                  ) : (
                    <span className={styles.orderItemPlaceholder} aria-hidden />
                  )}
                </div>
                <div className={styles.orderItemBody}>
                  <span className={styles.orderItemName}>{item.name}</span>
                  <span className={styles.orderItemMeta}>
                    {item.quantity} × ${Number(item.price).toFixed(2)}
                  </span>
                </div>
                <div className={styles.orderItemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            );
            })}
          </ul>

          <footer className={styles.orderCardFooter}>
            <span className={styles.orderTotalLabel}>Разом</span>
            <span className={styles.orderTotalValue}>
              ${Number(order.total).toFixed(2)}
            </span>
          </footer>

          {order.status === "new" && (
            <div className={styles.orderCardActions}>
              <AcceptOrderButton
                orderId={order.id}
                status={order.status}
                onAcceptSuccess={refetch}
              />
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
