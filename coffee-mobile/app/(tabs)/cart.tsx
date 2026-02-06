import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../../context/cart-context";
import { useOrders } from "../../context/orders-context";
import { menuCategories } from "../../data/menu-data";
import { useExpoPushToken } from "../../hooks/use-expo-push-token";
import { insertOrder, isSupabaseConfigured } from "../../services/supabase";
import { Colors, Spacing, Radius, FontSize, Shadow } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";

const SUPABASE_CONFIG_ERROR =
  "Supabase не налаштовано. Додайте в coffee-mobile/.env.local змінні EXPO_PUBLIC_SUPABASE_URL та EXPO_PUBLIC_SUPABASE_ANON_KEY (див. README).";

function formatEuro(value: number): string {
  return `€${value.toFixed(2)}`;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const theme = Colors[useColorScheme() ?? "light"];
  const { items, totalPrice, clearCart, removeItem, removeItemCompletely, addItem } =
    useCart();
  const { addOrder } = useOrders();
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const router = useRouter();
  const pushToken = useExpoPushToken();
  const supabaseReady = isSupabaseConfigured();
  const list = useMemo(() => Object.values(items), [items]);
  const imageById = useMemo(() => {
    const entries = menuCategories.flatMap((category) => category.items);
    return entries.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.imageUrl;
      return acc;
    }, {});
  }, []);

  const handlePlaceOrder = async () => {
    if (!supabaseReady || isPlacing || list.length === 0) return;
    setIsPlacing(true);
    setPlaceError(null);

    const orderItems = list.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: imageById[item.id] ?? undefined,
    }));

    const { data, error } = await insertOrder(
      orderItems,
      totalPrice,
      "new",
      pushToken
    );

    if (error) {
      setPlaceError(error.message);
      setIsPlacing(false);
      return;
    }

    if (data) {
      addOrder({
        orderId: data.id,
        total: data.total,
        status: data.status,
        createdAt: new Date().toISOString(),
        items: orderItems.map((it) => ({
          id: it.id,
          title: it.name,
          qty: it.quantity,
          price: it.price,
        })),
      });
      clearCart();
      router.push("/orders");
    } else {
      setPlaceError("Помилка замовлення.");
    }
    setIsPlacing(false);
  };

  const renderFooter = () =>
    list.length > 0 ? (
      <View style={[styles.footer, { backgroundColor: theme.surface }]}>
        {!supabaseReady ? (
          <Text style={styles.error}>{SUPABASE_CONFIG_ERROR}</Text>
        ) : placeError ? (
          <Text style={styles.error}>{placeError}</Text>
        ) : null}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Разом</Text>
          <Text style={styles.totalValue}>{formatEuro(totalPrice)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.placeButton,
            (pressed || !supabaseReady || isPlacing || list.length === 0) &&
              styles.placeButtonPressed,
          ]}
          onPress={handlePlaceOrder}
          disabled={!supabaseReady || isPlacing || list.length === 0}
        >
          <Text style={styles.placeButtonText}>
            {isPlacing ? "Оформлення…" : "Оформити замовлення"}
          </Text>
        </Pressable>
      </View>
    ) : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.lg, backgroundColor: theme.backgroundSecondary }]}>
      <Text style={[styles.title, { color: theme.text }]}>Кошик</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={list.length === 0 ? styles.listEmpty : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="bag" size={80} color={theme.textSecondary} style={{ opacity: 0.7 }} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Ваш кошик порожній</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Додайте товари з меню, щоб почати!
            </Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <Pressable
                onPress={() => removeItemCompletely(item.id)}
                style={styles.swipeDelete}
              >
                <Text style={styles.swipeDeleteText}>Видалити</Text>
              </Pressable>
            )}
          >
            <View style={styles.row}>
              <Image
                source={{
                  uri:
                    imageById[item.id] ||
                    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
                }}
                style={styles.itemImage}
              />
              <View style={styles.rowText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.quantity} × {formatEuro(item.price)}
                </Text>
              </View>
              <View style={styles.rowActions}>
                <Text style={styles.itemSubtotal}>
                  {formatEuro(item.price * item.quantity)}
                </Text>
                <View style={styles.quantityControls}>
                  <Pressable
                    onPress={() => removeItem(item.id)}
                    style={({ pressed }) => [
                      styles.qtyButton,
                      pressed ? styles.qtyButtonPressed : null,
                    ]}
                    accessibilityLabel={`Decrease ${item.name}`}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => addItem(item)}
                    style={({ pressed }) => [
                      styles.qtyButton,
                      pressed ? styles.qtyButtonPressed : null,
                    ]}
                    accessibilityLabel={`Increase ${item.name}`}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  listEmpty: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    textAlign: "center",
  },
  row: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  itemMeta: {
    color: "#6b7280",
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b4f2a",
  },
  rowActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  quantityControls: {
    flexDirection: "row",
    gap: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonPressed: {
    opacity: 0.7,
  },
  qtyButtonText: {
    fontSize: 18,
    lineHeight: 20,
    color: "#111827",
  },
  swipeDelete: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ef4444",
    borderRadius: 14,
    marginHorizontal: 20,
    marginVertical: 6,
    paddingHorizontal: 18,
  },
  swipeDeleteText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  error: {
    color: "#b91c1c",
    marginBottom: 8,
  },
  footer: {
    marginTop: Spacing.lg,
    marginHorizontal: 0,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  placeButtonPressed: {
    opacity: 0.7,
  },
  placeButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
