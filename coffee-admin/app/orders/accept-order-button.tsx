"use client";

import { useState } from "react";
import { acceptOrder } from "./actions";
import styles from "./orders.module.css";

type Props = {
  orderId: string;
  status: string;
  onAcceptSuccess?: () => void;
};

export function AcceptOrderButton({ orderId, status, onAcceptSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  if (status !== "new") return null;

  async function handleAccept() {
    setIsLoading(true);
    const { error } = await acceptOrder(orderId);
    setIsLoading(false);
    if (!error) {
      onAcceptSuccess?.();
    }
  }

  return (
    <button
      type="button"
      onClick={handleAccept}
      disabled={isLoading}
      className={styles.acceptButton}
    >
      {isLoading ? "Збереження…" : "Прийняти замовлення"}
    </button>
  );
}
