import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/context/cart-context";
import { Colors, Spacing, Radius, FontSize, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

/** Панель впритул до таб-бару (Меню, Кошик, Замовлення, Налаштування) */
const BOTTOM_GAP = 0;

export default function CartSummaryBar() {
  const router = useRouter();
  const { totalItems, totalPrice } = useCart();
  const theme = Colors[useColorScheme() ?? "light"];

  return (
    <View style={[styles.wrap, { bottom: BOTTOM_GAP }]}>
      <Pressable
        style={({ pressed }) => [
          styles.bar,
          { backgroundColor: theme.primary },
          pressed && styles.barPressed,
        ]}
        onPress={() => router.push("/cart")}
      >
        <Text style={[styles.text, { color: theme.primaryForeground }]}>
          {totalItems} {totalItems === 1 ? "товар" : "товарів"}
        </Text>
        <Text style={[styles.text, { color: theme.primaryForeground }]}>
          {formatEuro(totalPrice)}
        </Text>
      </Pressable>
    </View>
  );
}

function formatEuro(value: number): string {
  return `€${value.toFixed(2)}`;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
  },
  bar: {
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 52,
    ...Shadow.cardSubtle,
  },
  barPressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: FontSize.base,
    fontWeight: "600",
  },
});
