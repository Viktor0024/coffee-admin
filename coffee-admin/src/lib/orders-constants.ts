/** Статусы заказа для канбан-доски */
export const ORDER_STATUSES = [
  "new",
  "in_progress",
  "ready",
  "completed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Нові",
  in_progress: "В роботі",
  ready: "Готово",
  completed: "Завершені",
};

/** Колонки доски: статус і заголовок */
export const BOARD_COLUMNS: { status: OrderStatus; title: string }[] = [
  { status: "new", title: "Нові" },
  { status: "in_progress", title: "В роботі" },
  { status: "ready", title: "Готово" },
  { status: "completed", title: "Завершені" },
];

/** Порог (минуты): заказ без обработки дольше — подсветка */
export const STALE_ORDER_MINUTES = 10;

/** Следующий статус по цепочке (для кнопок) */
export const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  new: "in_progress",
  in_progress: "ready",
  ready: "completed",
  completed: null,
};

export const ACTION_BUTTON_LABELS: Record<OrderStatus, string> = {
  new: "Взяти в роботу",
  in_progress: "Готово",
  ready: "Завершити",
  completed: "",
};
