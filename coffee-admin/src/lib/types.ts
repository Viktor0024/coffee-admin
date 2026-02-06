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
