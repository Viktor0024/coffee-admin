export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
  updated_at?: string;
};

export type MenuCategoryDb = {
  id: string;
  name: string;
  image: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type MenuItemDb = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image_url: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type MenuCategoryWithItems = MenuCategoryDb & { items: MenuItemDb[] };
