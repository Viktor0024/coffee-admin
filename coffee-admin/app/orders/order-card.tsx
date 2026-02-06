"use client";

import { useState } from "react";
import type { Order, OrderItem } from "@/lib/types";
import type { OrderStatus } from "@/lib/orders-constants";
import {
  STALE_ORDER_MINUTES,
  NEXT_STATUS,
  ACTION_BUTTON_LABELS,
} from "@/lib/orders-constants";
import { getPublicStorageUrl } from "@/lib/storage";
import { updateOrderStatus } from "./actions";
import { OrderItemsPreview } from "./order-items-preview";
import styles from "./orders.module.css";

type OrderCardProps = {
  order: Order;
  onStatusChanged?: (orderId: string, newStatus: OrderStatus) => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isStale(createdAt: string, status: string): boolean {
  if (status !== "new") return false;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const minutes = (now - created) / (60 * 1000);
  return minutes >= STALE_ORDER_MINUTES;
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

function CardThumbnail({ item }: { item: OrderItem }) {
  const [failed, setFailed] = useState(false);
  const src = getPublicStorageUrl(item.image_url);

  if (failed || !src) {
    return (
      <div className={styles.kanbanCardThumbPlaceholder} title={item.name}>
        <span className={styles.kanbanCardThumbEmoji}>☕</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className={styles.kanbanCardThumb}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function OrderCard({ order, onStatusChanged }: OrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const nextStatus = NEXT_STATUS[order.status as OrderStatus];
  const buttonLabel = order.status in ACTION_BUTTON_LABELS
    ? ACTION_BUTTON_LABELS[order.status as OrderStatus]
    : "";

  const stale = isStale(order.created_at, order.status);

  async function handleAction() {
    if (!nextStatus) return;
    setIsLoading(true);
    const { error } = await updateOrderStatus(order.id, nextStatus);
    setIsLoading(false);
    if (!error) onStatusChanged?.(order.id, nextStatus);
  }

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("application/order-id", order.id);
    e.dataTransfer.effectAllowed = "move";
  }

  const thumbItems = order.items.slice(0, 4);
  const hasItems = order.items.length > 0;

  return (
    <article
      className={`${styles.kanbanCard} ${stale ? styles.kanbanCardStale : ""} ${styles[`kanbanCardStatus_${order.status}`] ?? ""}`}
      data-order-id={order.id}
      draggable={true}
      onDragStart={handleDragStart}
    >
      {hasItems && (
        <div className={styles.kanbanCardPreview}>
          {thumbItems.map((item) => (
            <CardThumbnail key={`${order.id}-${item.id}`} item={item} />
          ))}
        </div>
      )}
      <div className={styles.kanbanCardHeader}>
        <span className={styles.kanbanCardId} title={order.id}>
          #{shortId(order.id)}
        </span>
        <time className={styles.kanbanCardTime} dateTime={order.created_at}>
          {formatDate(order.created_at)}
        </time>
      </div>
      {hasItems && (
        <OrderItemsPreview
          items={order.items}
          id={`order-${shortId(order.id)}`}
        />
      )}
      <p className={styles.kanbanCardTotal}>
        ${Number(order.total).toFixed(2)}
      </p>
      {stale && (
        <p className={styles.kanbanCardStaleLabel} role="status">
          Довго без обробки
        </p>
      )}
      {buttonLabel && (
        <button
          type="button"
          onClick={handleAction}
          disabled={isLoading}
          className={styles.kanbanCardButton}
        >
          {isLoading ? "…" : buttonLabel}
        </button>
      )}
    </article>
  );
}
