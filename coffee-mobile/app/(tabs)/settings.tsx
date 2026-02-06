import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Radius, FontSize, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type SettingsItemProps = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
};

function SettingsItem({ icon, title, subtitle, onPress }: SettingsItemProps) {
  const theme = Colors[useColorScheme() ?? "light"];
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={onPress}
    >
      <IconSymbol name={icon as any} size={22} color={theme.text} />
      <View style={styles.itemText}>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
        {subtitle != null && (
          <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <IconSymbol name="chevron.right" size={16} color={theme.textSecondary} />
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  const theme = Colors[useColorScheme() ?? "light"];
  return (
    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
      {title}
    </Text>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  const theme = Colors[useColorScheme() ?? "light"];
  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.cardSubtle]}>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = Colors[useColorScheme() ?? "light"];

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.lg, backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Налаштування</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="АКАУНТ" />
        <SettingsCard>
          <SettingsItem icon="person.circle" title="Профіль" subtitle="Іван Петренко" />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingsItem icon="bell" title="Сповіщення" />
        </SettingsCard>

        <SectionHeader title="НАЛАШТУВАННЯ" />
        <SettingsCard>
          <SettingsItem icon="mappin.and.ellipse" title="Збережені адреси" subtitle="2 адреси" />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingsItem icon="creditcard" title="Способи оплати" subtitle="1 картка" />
        </SettingsCard>

        <SectionHeader title="ПІДТРИМКА" />
        <SettingsCard>
          <SettingsItem icon="questionmark.circle" title="Центр допомоги" />
          <View style={[styles.separator, { backgroundColor: theme.border }]} />
          <SettingsItem icon="rectangle.portrait.and.arrow.right" title="Вийти" />
        </SettingsCard>

        <Text style={[styles.version, { color: theme.textSecondary }]}>
          Версія 1.0.0
        </Text>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 160,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  card: {
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  itemPressed: {
    opacity: 0.8,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSize.base,
    fontWeight: "500",
  },
  itemSubtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginLeft: Spacing.lg + 22 + Spacing.md,
  },
  version: {
    fontSize: FontSize.xs,
    textAlign: "center",
    marginTop: Spacing.xxl,
  },
});
