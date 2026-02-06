"use client";

import { useState, useRef, useEffect } from "react";
import type { OrderItem } from "@/lib/types";
import styles from "./orders.module.css";

const MAX_VISIBLE = 3;

type OrderItemsPreviewProps = {
  items: OrderItem[];
  /** Уникальный id для aria */
  id?: string;
};

/** Эвристика иконки по названию (опционально) */
function itemIcon(name: string): string {
  const n = name.toLowerCase();
  
  // Кава
  if (/espresso|еспресо/.test(n)) return "☕";
  if (/latte|лате/.test(n)) return "☕";
  if (/cappuccino|капучино/.test(n)) return "☕";
  if (/americano|американо/.test(n)) return "☕";
  if (/mocha|мокачино|мока/.test(n)) return "☕";
  if (/flat.white|флет.вайт|флет/.test(n)) return "☕";
  if (/macchiato|макіато/.test(n)) return "☕";
  if (/coffee|кофе/.test(n)) return "☕";
  
  // Чай
  if (/green.tea|зелений.чай/.test(n)) return "🫖";
  if (/black.tea|чорний.чай/.test(n)) return "🫖";
  if (/iced.tea|холодний.чай/.test(n)) return "🧊";
  if (/earl.grey|айрл.грей/.test(n)) return "🫖";
  if (/chamomile|ромашковий/.test(n)) return "🫖";
  if (/mint|м'ятний|мятний/.test(n)) return "🫖";
  if (/tea|чай/.test(n)) return "🫖";
  
  // Десерти
  if (/pancake|млинці|блини/.test(n)) return "🥞";
  if (/croissant|круасан/.test(n)) return "🥐";
  if (/cheesecake|чізкейк|чизкейк/.test(n)) return "🍰";
  if (/brownie|брауні/.test(n)) return "🍫";
  if (/muffin|мафін/.test(n)) return "🧁";
  if (/tiramisu|тірамісу/.test(n)) return "🍰";
  if (/cake|торт|кекс/.test(n)) return "🧁";
  if (/dessert|десерт/.test(n)) return "🧁";
  
  // Морозиво
  if (/vanilla|ваніль/.test(n)) return "🍦";
  if (/chocolate|шоколад/.test(n)) return "🍫";
  if (/strawberry|полуниця|клубника/.test(n)) return "🍓";
  if (/pistachio|фісташка|фисташка/.test(n)) return "🍦";
  if (/caramel|карамель/.test(n)) return "🍮";
  if (/ice.cream|морозиво/.test(n)) return "🍦";
  
  // За замовчуванням
  return "🍽";
}

function ItemLine({ item }: { item: OrderItem }) {
  const icon = itemIcon(item.name);
  return (
    <span className={styles.itemsPreviewLine}>
      <span className={styles.itemsPreviewIcon} aria-hidden>{icon}</span>
      <span className={styles.itemsPreviewText}>
        {item.name} ×{item.quantity}
      </span>
    </span>
  );
}

export function OrderItemsPreview({ items, id }: OrderItemsPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const visible = items.slice(0, MAX_VISIBLE);
  const restCount = items.length - MAX_VISIBLE;
  const showMore = restCount > 0;

  const isOpen = expanded || hover;
  const canExpand = showMore;

  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  const content = (
    <span className={styles.itemsPreviewShort}>
      {visible.map((item) => (
        <ItemLine key={`${item.id}-${item.quantity}`} item={item} />
      ))}
      {showMore && (
        <span className={styles.itemsPreviewMore}>
          +{restCount} ще
        </span>
      )}
    </span>
  );

  return (
    <div
      ref={containerRef}
      className={styles.itemsPreview}
      onMouseEnter={() => canExpand && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {canExpand ? (
        <button
          type="button"
          className={styles.itemsPreviewTrigger}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          aria-expanded={isOpen}
          aria-controls={id ? `${id}-full-list` : undefined}
          id={id ? `${id}-trigger` : undefined}
        >
          {content}
          <span className={styles.itemsPreviewChevron} aria-hidden>
            {isOpen ? "▼" : "▶"}
          </span>
        </button>
      ) : (
        <div className={`${styles.itemsPreviewTrigger} ${styles.itemsPreviewTriggerStatic}`}>
          {content}
        </div>
      )}

      {isOpen && items.length > MAX_VISIBLE && (
        <div
          id={id ? `${id}-full-list` : undefined}
          className={styles.itemsPreviewFull}
          role="region"
          aria-label="Повний список позицій"
        >
          {items.map((item) => (
            <ItemLine key={`${item.id}-${item.quantity}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
