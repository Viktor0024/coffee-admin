import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getBaseUrl } from "../services/api";
import { useOrders } from "../context/orders-context";
import { Colors, Spacing, Radius, FontSize, Shadow } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

const STATUS_LABELS: Record<string, string> = {
  new: "Новий",
  in_progress: "Готується",
  accepted: "Готується",
  preparing: "Готується",
  ready: "Готовий",
  completed: "Виконано",
};

function formatEuro(value: number): string {
  return `€${value.toFixed(2)}`;
}

function shortId(id: string): string {
  if (!id || id.length < 12) return id;
  return `${id.slice(0, 8)}…`;
}

export default function OrderStatusScreen() {
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const theme = Colors[useColorScheme() ?? "light"];

  const resolvedOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
  const orderFromContext = orders.find((o) => o.orderId === resolvedOrderId);

  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status = serverStatus ?? orderFromContext?.status ?? "preparing";
  const total = serverTotal ?? orderFromContext?.total ?? 0;
  const items = orderFromContext?.items ?? [];
  const statusLabel = STATUS_LABELS[status] ?? status;

  useEffect(() => {
    if (!resolvedOrderId) return;

    let isActive = true;
    const fetchStatus = async () => {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/orders/${resolvedOrderId}`);
        const text = await response.text();
        if (!isActive) return;

        const data = (() => {
          try {
            return JSON.parse(text) as { status?: string; total?: number };
          } catch {
            return null;
          }
        })();

        if (data && response.ok) {
          setServerStatus(data.status ?? null);
          setServerTotal(data.total != null ? Number(data.total) : null);
        }
      } catch {
        // використовуємо дані з контексту
      }
    };

    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 5000);

    return () => {
      isActive = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [resolvedOrderId]);

  if (!resolvedOrderId) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + Spacing.lg, backgroundColor: theme.backgroundSecondary }]}>
        <Text style={[styles.noOrder, { color: theme.textSecondary }]}>Замовлення не знайдено.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      contentContainerStyle={{ paddingTop: Spacing.lg, paddingBottom: insets.bottom + Spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.card]}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>НОМЕР ЗАМОВЛЕННЯ</Text>
          <Text style={[styles.value, { color: theme.text }]} selectable>
            {shortId(resolvedOrderId)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>СТАТУС</Text>
          <Text style={[styles.statusValue, { color: theme.text }]}>{statusLabel}</Text>
        </View>

        {items.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>СКЛАД ЗАМОВЛЕННЯ</Text>
              {items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.itemMeta, { color: theme.textSecondary }]}>
                    {item.qty} × {formatEuro(item.price)}
                  </Text>
                  <Text style={[styles.itemSum, { color: theme.priceAccent }]}>
                    {formatEuro(item.qty * item.price)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Разом</Text>
          <Text style={[styles.totalValue, { color: theme.priceAccent }]}>{formatEuro(total)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noOrder: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    fontSize: FontSize.base,
  },
  card: {
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  section: {
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSize.base,
    fontWeight: "600",
  },
  statusValue: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: FontSize.base,
  },
  itemMeta: {
    fontSize: FontSize.sm,
  },
  itemSum: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    minWidth: 56,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.sm,
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "700",
  },
});
