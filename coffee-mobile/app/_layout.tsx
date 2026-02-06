import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOrderStatusRealtime } from '@/hooks/use-order-status-realtime';
import { CartProvider } from '../context/cart-context';
import { OrdersProvider } from '../context/orders-context';

function OrderStatusRealtimeSubscriber() {
  useOrderStatusRealtime();
  return null;
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <OrdersProvider>
            <OrderStatusRealtimeSubscriber />
            <CartProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="order-status"
                  options={{
                    title: "Статус замовлення",
                    headerBackTitle: "Назад",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: "#ffffff" },
                    headerTintColor: "#1a1a1a",
                    headerTitleStyle: { fontWeight: "700", fontSize: 18 },
                  }}
                />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </CartProvider>
          </OrdersProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
