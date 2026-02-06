export type OrderItem = {
    id: string;
    title: string;
    qty: number;
    price: number;
  };
  
  export type Order = {
    orderId: string;
    status: string;
    createdAt: string;
    total: number;
    items: OrderItem[];
  };
  