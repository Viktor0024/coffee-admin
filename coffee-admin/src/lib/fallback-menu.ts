/**
 * Резервне меню для відображення, якщо Supabase ще не налаштовано або таблиці відсутні.
 * Відповідає поточному меню з coffee-mobile (menu-data.ts).
 */
import type { MenuCategoryWithItems } from "@/lib/types";

export const fallbackMenu: MenuCategoryWithItems[] = [
  {
    id: "coffee",
    name: "Кава",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    sort_order: 1,
    items: [
      { id: "coffee-espresso", category_id: "coffee", name: "Еспресо", price: 3.0, image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", sort_order: 1 },
      { id: "coffee-latte", category_id: "coffee", name: "Лате", price: 4.5, image_url: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400", sort_order: 2 },
      { id: "coffee-cappuccino", category_id: "coffee", name: "Капучино", price: 4.0, image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400", sort_order: 3 },
      { id: "coffee-americano", category_id: "coffee", name: "Американо", price: 3.5, image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", sort_order: 4 },
      { id: "coffee-mocha", category_id: "coffee", name: "Мокачино", price: 4.8, image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400", sort_order: 5 },
      { id: "coffee-flat-white", category_id: "coffee", name: "Флет-вайт", price: 4.2, image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", sort_order: 6 },
      { id: "coffee-macchiato", category_id: "coffee", name: "Макіато", price: 3.8, image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400", sort_order: 7 },
    ],
  },
  {
    id: "tea",
    name: "Чай",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600",
    sort_order: 2,
    items: [
      { id: "tea-green", category_id: "tea", name: "Зелений чай", price: 1.0, image_url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400", sort_order: 1 },
      { id: "tea-black", category_id: "tea", name: "Чорний чай", price: 2.5, image_url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400", sort_order: 2 },
      { id: "tea-iced", category_id: "tea", name: "Холодний чай", price: 3.5, image_url: "https://masterpiecer-images.s3.yandex.net/a9bcff5b7bc611eebb2eb646b2a0ffc1:upscaled", sort_order: 3 },
      { id: "tea-chamomile", category_id: "tea", name: "Ромашковий чай", price: 3.0, image_url: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80", sort_order: 4 },
      { id: "tea-mint", category_id: "tea", name: "Мʼятний чай", price: 3.2, image_url: "https://здоровое-питание.рф/upload/iblock/744/l0l1bjj9168mbvqa9kfhoidqyc4pnhs4/lori_0042181802_bigwww-_1_.jpg", sort_order: 5 },
    ],
  },
  {
    id: "desserts",
    name: "Десерти",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
    sort_order: 3,
    items: [
      { id: "dessert-croissant", category_id: "desserts", name: "Круасан", price: 4.0, image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", sort_order: 1 },
      { id: "dessert-cheesecake", category_id: "desserts", name: "Чізкейк", price: 5.0, image_url: "https://images.unsplash.com/photo-1533134242443-d4ea4b2f4a28?w=400", sort_order: 2 },
      { id: "dessert-brownie", category_id: "desserts", name: "Брауні", price: 4.5, image_url: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400", sort_order: 3 },
      { id: "dessert-muffin", category_id: "desserts", name: "Мафін", price: 3.5, image_url: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", sort_order: 4 },
      { id: "dessert-tiramisu", category_id: "desserts", name: "Тірамісу", price: 5.5, image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400", sort_order: 5 },
      { id: "dessert-pancake", category_id: "desserts", name: "Млинці", price: 4.2, image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", sort_order: 6 },
    ],
  },
  {
    id: "icecream",
    name: "Морозиво",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600",
    sort_order: 4,
    items: [
      { id: "ice-vanilla", category_id: "icecream", name: "Ваніль", price: 3.5, image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", sort_order: 1 },
      { id: "ice-chocolate", category_id: "icecream", name: "Шоколад", price: 4.0, image_url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400", sort_order: 2 },
      { id: "ice-strawberry", category_id: "icecream", name: "Полуниця", price: 3.8, image_url: "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400", sort_order: 3 },
      { id: "ice-pistachio", category_id: "icecream", name: "Фісташка", price: 4.2, image_url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400", sort_order: 4 },
      { id: "ice-caramel", category_id: "icecream", name: "Карамель", price: 4.0, image_url: "https://images.unsplash.com/photo-1560008581-98ca2fd13b15?w=400", sort_order: 5 },
    ],
  },
];
