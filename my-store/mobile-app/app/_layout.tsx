import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../src/stores/authStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const { loadUser } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="wishlist" />
          <Stack.Screen name="orders" />
          <Stack.Screen name="ai-chat" />
          <Stack.Screen name="delivery-addresses" />
          <Stack.Screen name="payment-methods" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="support" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

