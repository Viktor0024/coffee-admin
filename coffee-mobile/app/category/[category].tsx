import { useMemo, useLayoutEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { useCart } from "../../context/cart-context";
import { menuCategories, MenuItem } from "../../data/menu-data";
import { Colors, Spacing, FontSize } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

function formatEuro(value: number): string {
  return `€${value.toFixed(2)}`;
}

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const navigation = useNavigation();
  const { addItem, removeItem, items: cartItems, totalItems, totalPrice } = useCart();
  const theme = Colors[useColorScheme() ?? "light"];
  const selected = useMemo(
    () => menuCategories.find((entry) => entry.id === category),
    [category]
  );

  const items = selected?.items ?? [];
  const categoryTitle = selected?.title || "Категорія";

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: categoryTitle });
  }, [navigation, categoryTitle]);

  return (
    <View style={[styles.container, { backgroundColor: "#f8f8f8" }]}>
      {totalItems > 0 && (
        <View style={[styles.cartSummary, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cartSummaryLabel, { color: theme.textSecondary }]}>
            В кошику: {totalItems} {totalItems === 1 ? "товар" : "товарів"}
          </Text>
          <Text style={[styles.cartSummaryPrice, { color: theme.priceAccent }]}>
            {formatEuro(totalPrice)}
          </Text>
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const qty = cartItems[item.id]?.quantity ?? 0;
          const subtotal = item.price * (qty || 1);
          return (
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: theme.priceAccent }]}>
                    {qty > 0 ? formatEuro(subtotal) : formatEuro(item.price)}
                  </Text>
                </View>
                <Text style={[styles.itemMeta, { color: theme.textSecondary }]}>
                  {qty > 0 ? `${qty} × ${formatEuro(item.price)}` : formatEuro(item.price)}
                </Text>
                <View style={styles.cardFooter}>
                  {qty > 0 ? (
                    <View style={styles.quantityRow}>
                      <Pressable
                        onPress={() => removeItem(item.id)}
                        style={({ pressed }) => [
                          styles.qtyButton,
                          { backgroundColor: "#e8e8e8" },
                          pressed && styles.qtyButtonPressed,
                        ]}
                      >
                        <Text style={[styles.qtyButtonText, { color: theme.text }]}>−</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => addItem(item as MenuItem)}
                        style={({ pressed }) => [
                          styles.qtyButton,
                          { backgroundColor: "#e8e8e8" },
                          pressed && styles.qtyButtonPressed,
                        ]}
                      >
                        <Text style={[styles.qtyButtonText, { color: theme.text }]}>+</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => addItem(item as MenuItem)}
                      style={({ pressed }) => [
                        styles.addToCartButton,
                        pressed && styles.addLinkPressed,
                      ]}
                    >
                      <Text style={[styles.addToCartText, { color: theme.text }]}>
                        Додати в кошик
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.subtle, { color: theme.textSecondary }]}>Немає позицій у цій категорії.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  cartSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cartSummaryLabel: {
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  cartSummaryPrice: {
    fontSize: FontSize.base,
    fontWeight: "700",
  },
  list: {
    paddingBottom: 24,
    gap: 14,
  },
  subtle: {
    fontSize: FontSize.sm,
  },
  card: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minHeight: 110,
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#eeeeee",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
    minHeight: 88,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  itemMeta: {
    fontSize: 13,
    marginTop: 2,
    color: "#6a6a6a",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 6,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonPressed: {
    opacity: 0.7,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
  },
  addToCartButton: {
    backgroundColor: "#e8e8e8",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: "500",
  },
  addLinkPressed: {
    opacity: 0.75,
  },
});
