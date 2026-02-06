import { useMemo } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { menuCategories } from "../../data/menu-data";
import {
  Colors,
  Spacing,
  Radius,
  FontSize,
  Shadow,
} from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import CartSummaryBar from "@/components/ui/CartSummaryBar";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const categories = useMemo(() => menuCategories, []);
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.lg,
          backgroundColor: theme.backgroundSecondary,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Меню</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Оберіть категорію для перегляду.
        </Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.categoryRow}
        contentContainerStyle={styles.categoryList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.categoryCard,
              { backgroundColor: theme.surface },
              Shadow.card,
              pressed && styles.categoryCardPressed,
            ]}
            onPress={() => router.push(`/category/${item.id}`)}
          >
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.categoryTitle, { color: theme.text }]} numberOfLines={1}>
              {item.title}
            </Text>
          </Pressable>
        )}
      />
      <CartSummaryBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
  },
  categoryList: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 140,
    gap: Spacing.lg,
  },
  categoryRow: {
    gap: Spacing.lg,
  },
  categoryCard: {
    flex: 1,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow.card,
  },
  categoryCardPressed: {
    opacity: 0.92,
  },
  imageWrap: {
    overflow: "hidden",
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  categoryImage: {
    width: "100%",
    height: 120,
  },
  categoryTitle: {
    fontSize: FontSize.base,
    fontWeight: "600",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
});
