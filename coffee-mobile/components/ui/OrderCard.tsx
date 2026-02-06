import { View, Text, StyleSheet, Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Radius, FontSize, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Order } from "@/data/order";

const STATUS_LABELS: Record<string, string> = {
  new: "Новий",
  in_progress: "Готується",
  accepted: "Готується",
  preparing: "Готується",
  ready: "Готовий",
  completed: "Виконано",
};

function formatOrderDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateOnly = (x: Date) => x.toDateString();
  if (dateOnly(d) === dateOnly(today)) {
    return `Сьогодні, ${d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (dateOnly(d) === dateOnly(yesterday)) {
    return "Вчора";
  }
  return d.toLocaleDateString("uk-UA");
}

function getItemCount(order: Order): number {
  return (order.items ?? []).reduce((s, i) => s + i.qty, 0);
}

type OrderCardProps = {
  order: Order;
  onPress: () => void;
};

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const theme = Colors[useColorScheme() ?? "light"];
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const isCompleted = order.status === "completed";
  const isPreparing =
    order.status === "in_progress" ||
    order.status === "accepted" ||
    order.status === "preparing" ||
    order.status === "new";
  const statusColor = isCompleted ? theme.statusCompleted : theme.statusPreparing;
  const itemCount = getItemCount(order);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surface },
        Shadow.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.statusRow}>
          <IconSymbol
            name={isCompleted ? "checkmark.circle.fill" : "clock.fill"}
            size={20}
            color={statusColor}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
        <Text style={[styles.total, { color: theme.text }]}>
          €{order.total.toFixed(2)}
        </Text>
      </View>
      <Text style={[styles.orderId, { color: theme.textSecondary }]} numberOfLines={1}>
        Замовлення #{order.orderId}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {formatOrderDate(order.createdAt)}
        </Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {itemCount} {itemCount === 1 ? "товар" : "товарів"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardPressed: {
    opacity: 0.95,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  total: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  orderId: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: FontSize.xs,
  },
});
