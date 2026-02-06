require("dotenv").config();
const express = require("express");
const { createOrder, getOrderById } = require("./services/supabase");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

const menu = [
  { id: "coffee-espresso", name: "Espresso", price: 3.0 },
  { id: "coffee-latte", name: "Latte", price: 4.5 },
  { id: "drink-iced-tea", name: "Iced Tea", price: 3.5 },
  { id: "food-croissant", name: "Croissant", price: 4.0 },
];

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const normalized = items.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
  }));
  const invalid = normalized.some(
    (item) =>
      !item.id ||
      !item.name ||
      !Number.isFinite(item.price) ||
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0
  );
  return invalid ? null : normalized;
}

async function persistOrder(normalizedItems) {
  const total = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const createdAt = new Date().toISOString();
  const { data, error } = await createOrder({
    items: normalizedItems,
    total,
    status: "new",
    createdAt,
  });
  if (error) throw error;
  return data;
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/menu", (req, res) => {
  res.json({ data: menu });
});

app.post("/orders", async (req, res) => {
  const { items } = req.body || {};
  const normalizedItems = normalizeItems(items);
  if (!normalizedItems) {
    return res.status(400).json({ error: "Items are required." });
  }
  try {
    const data = await persistOrder(normalizedItems);
    return res.status(201).json({
      orderId: data.orderId,
      total: data.total,
      status: data.status,
    });
  } catch (err) {
    console.error("Supabase createOrder error:", err);
    return res.status(500).json({ error: "Failed to save order." });
  }
});

app.get("/orders/:id", async (req, res) => {
  const { data, error } = await getOrderById(req.params.id);
  if (error) {
    console.error("Supabase getOrderById error:", error);
    return res.status(500).json({ error: "Failed to load order." });
  }
  if (!data) {
    return res.status(404).json({ error: "Order not found." });
  }
  return res.json({
    id: data.orderId,
    items: data.items,
    total: data.total,
    status: data.status,
  });
});

// POST /order — alias for placing order (same as /orders)
app.post("/order", async (req, res) => {
  const { items } = req.body || {};
  const normalizedItems = normalizeItems(items);
  if (!normalizedItems) {
    return res.status(400).json({ error: "Items are required." });
  }
  try {
    const data = await persistOrder(normalizedItems);
    return res.status(201).json({
      orderId: data.orderId,
      total: data.total,
      status: data.status,
    });
  } catch (err) {
    console.error("Supabase createOrder error:", err);
    return res.status(500).json({ error: "Failed to save order." });
  }
});

// GET /status?orderId=xxx or GET /status/:orderId — order status
app.get("/status", async (req, res) => {
  const orderId = req.query.orderId;
  if (!orderId) {
    return res.status(400).json({ error: "orderId is required." });
  }
  const { data, error } = await getOrderById(orderId);
  if (error) {
    console.error("Supabase getOrderById error:", error);
    return res.status(500).json({ error: "Failed to load order." });
  }
  if (!data) {
    return res.status(404).json({ error: "Order not found." });
  }
  return res.json({
    orderId: data.orderId,
    status: data.status,
    total: data.total,
  });
});
app.get("/status/:orderId", async (req, res) => {
  const { data, error } = await getOrderById(req.params.orderId);
  if (error) {
    console.error("Supabase getOrderById error:", error);
    return res.status(500).json({ error: "Failed to load order." });
  }
  if (!data) {
    return res.status(404).json({ error: "Order not found." });
  }
  return res.json({
    orderId: data.orderId,
    status: data.status,
    total: data.total,
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on http://localhost:3000");
});
