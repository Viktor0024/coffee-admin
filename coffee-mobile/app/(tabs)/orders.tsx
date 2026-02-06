import { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OrderCard from "@/components/ui/OrderCard";
import { useOrders } from "../../context/orders-context";
import { Colors, Spacing, FontSize } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const theme = Colors[useColorScheme() ?? "light"];
  const { orders } = useOrders();
  const router = useRouter();
  const list = useMemo(() => orders, [orders]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.lg, backgroundColor: theme.backgroundSecondary }]}>
      <Text style={[styles.title, { color: theme.text }]}>Замовлення</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.subtle, { color: theme.textSecondary }]}>
            Поки немає замовлень.
          </Text>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              router.push({
                pathname: "/order-status",
                params: { orderId: item.orderId },
              })
            }
          />
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
    marginBottom: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 32,
    gap: Spacing.md,
  },
  subtle: {
    fontSize: FontSize.sm,
  },
});
