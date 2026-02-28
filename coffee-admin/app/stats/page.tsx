"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Order, OrderItem } from "@/lib/types";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders-constants";
import styles from "./stats.module.css";

type OrderStatusCount = Record<OrderStatus, number>;

type TopItem = {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
};

function aggregateTopItems(orders: Order[]): TopItem[] {
  const byId = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items as OrderItem[]) {
      const key = item.id;
      const cur = byId.get(key);
      const q = item.quantity ?? 0;
      const rev = (item.price ?? 0) * q;
      if (cur) {
        cur.quantity += q;
        cur.revenue += rev;
      } else {
        byId.set(key, { name: item.name ?? "—", quantity: q, revenue: rev });
      }
    }
  }
  return Array.from(byId.entries())
    .map(([id, v]) => ({ id, name: v.name, quantity: v.quantity, revenue: v.revenue }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 15);
}

function countByStatus(orders: Order[]): OrderStatusCount {
  const counts: OrderStatusCount = {
    new: 0,
    in_progress: 0,
    ready: 0,
    completed: 0,
  };
  for (const o of orders) {
    if (o.status in counts) counts[o.status as OrderStatus]++;
  }
  return counts;
}

export default function StatsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase не налаштовано. Задайте в .env.local змінні NEXT_PUBLIC_SUPABASE_URL та NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, err } = await supabase
          .from("orders")
          .select("id, items, total, status, created_at")
          .order("created_at", { ascending: false });

        if (cancelled) return;
        if (err) {
          setError(err.message);
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
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>← Головна</Link>
          <h1 className={styles.title}>Статистика покупок</h1>
        </header>
        <div className={styles.error}>{error}</div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>← Головна</Link>
          <h1 className={styles.title}>Статистика покупок</h1>
        </header>
        <p className={styles.empty}>Завантаження…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>← Головна</Link>
          <h1 className={styles.title}>Статистика покупок</h1>
        </header>
        <div className={styles.error}>{error}</div>
      </main>
    );
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const completedOrders = orders.filter((o) => o.status === "completed");
  const completedRevenue = completedOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const byStatus = countByStatus(orders);
  const topItems = aggregateTopItems(orders);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Головна</Link>
        <h1 className={styles.title}>Статистика покупок</h1>
        <p className={styles.subtitle}>Підсумки за всіма замовленнями</p>
      </header>

      <section className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Усього замовлень</span>
          <span className={styles.cardValue}>{totalOrders}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Сума всіх замовлень (грн)</span>
          <span className={styles.cardValue}>{totalRevenue.toFixed(2)}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Завершених замовлень</span>
          <span className={styles.cardValue}>{completedOrders.length}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Виручка по завершених (грн)</span>
          <span className={styles.cardValue}>{completedRevenue.toFixed(2)}</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>По статусах</h2>
        <ul className={styles.statusList} role="list">
          {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([status, label]) => (
            <li key={status} className={styles.statusRow}>
              <span className={styles.statusLabel}>{label}</span>
              <span className={styles.statusCount}>{byStatus[status]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Топ позицій за кількістю продажів</h2>
        {topItems.length === 0 ? (
          <p className={styles.empty}>Немає даних про позиції в замовленнях.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Позиція</th>
                  <th className={styles.thNum}>Кількість</th>
                  <th className={styles.thNum}>Сума (грн)</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.id}>
                    <td className={styles.td}>{item.name}</td>
                    <td className={styles.tdNum}>{item.quantity}</td>
                    <td className={styles.tdNum}>{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
