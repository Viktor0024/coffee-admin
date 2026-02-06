"use client";

import type { Order } from "@/lib/types";
import type { OrderStatus } from "@/lib/orders-constants";
import { OrderCard } from "./order-card";
import styles from "./orders.module.css";

type KanbanColumnProps = {
  status: OrderStatus;
  title: string;
  orders: Order[];
  onOrderMoved?: (orderId: string, newStatus: OrderStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: OrderStatus) => void;
};

export function KanbanColumn({
  status,
  title,
  orders,
  onOrderMoved,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  return (
    <section
      className={`${styles.kanbanColumn} ${styles[`kanbanColumn_${status}`] ?? ""}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <h2 className={styles.kanbanColumnTitle}>
        {title}
        <span className={styles.kanbanColumnCount}>{orders.length}</span>
      </h2>
      <div className={styles.kanbanColumnCards}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChanged={onOrderMoved}
          />
        ))}
      </div>
    </section>
  );
}
