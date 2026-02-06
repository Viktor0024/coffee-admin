import Link from "next/link";
import { KanbanBoard } from "./kanban-board";
import styles from "./orders.module.css";

export default function OrdersPage() {
  return (
    <main className={styles.ordersPage}>
      <header className={styles.ordersHeader}>
        <Link href="/" className={styles.backLink}>
          ← На головну
        </Link>
        <h1 className={styles.ordersTitle}>Замовлення</h1>
      </header>
      <KanbanBoard />
    </main>
  );
}
