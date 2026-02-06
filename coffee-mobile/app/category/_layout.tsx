import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "До меню",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#1a1a1a",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 24,
          letterSpacing: -0.3,
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="[category]" options={{ headerTitle: "" }} />
    </Stack>
  );
}
