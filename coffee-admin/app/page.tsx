import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Coffee Admin</h1>
        <p className={styles.subtitle}>
          Панель адміністратора замовлень та меню.
        </p>
      </header>
      <nav className={styles.grid} aria-label="Головна навігація">
        <Link href="/orders" className={`${styles.card} ${styles.cardOrders}`}>
          <div className={`${styles.cardIcon} ${styles.cardIconOrders}`} aria-hidden>
            📋
          </div>
          <h2 className={styles.cardTitle}>Замовлення</h2>
          <p className={styles.cardDesc}>
            Канбан-дошка: нові, в роботі, готово, завершені.
          </p>
          <span className={styles.cardArrow}>
            Відкрити <span aria-hidden>→</span>
          </span>
        </Link>
        <Link href="/stats" className={`${styles.card} ${styles.cardStats}`}>
          <div className={`${styles.cardIcon} ${styles.cardIconStats}`} aria-hidden>
            📊
          </div>
          <h2 className={styles.cardTitle}>Статистика покупок</h2>
          <p className={styles.cardDesc}>
            Підсумки, виручка, топ позицій за кількістю продажів.
          </p>
          <span className={styles.cardArrow}>
            Відкрити <span aria-hidden>→</span>
          </span>
        </Link>
        <Link href="/menu" className={`${styles.card} ${styles.cardMenu}`}>
          <div className={`${styles.cardIcon} ${styles.cardIconMenu}`} aria-hidden>
            ☕
          </div>
          <h2 className={styles.cardTitle}>Меню</h2>
          <p className={styles.cardDesc}>
            Категорії та позиції: додавати, редагувати, блокувати.
          </p>
          <span className={styles.cardArrow}>
            Відкрити <span aria-hidden>→</span>
          </span>
        </Link>
      </nav>
    </main>
  );
}
