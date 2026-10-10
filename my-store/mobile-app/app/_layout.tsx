import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../src/stores/authStore';
import { useProfile } from '../src/stores/profileStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomSplashScreen from '../src/components/CustomSplashScreen';

export default function RootLayout() {
  const loadUser = useAuth((state) => state.loadUser);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Load user data, then eagerly sync profile/preferences so currency and
    // profile details are correct on every screen without opening Settings.
    const initializeApp = async () => {
      try {
        await loadUser();
        if (!cancelled && useAuth.getState().isAuthenticated) {
          await useProfile.getState().load();
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        if (!cancelled) setIsAppReady(true);
      }
    };

    initializeApp();

    // Keep the profile store in sync with auth transitions (login/logout).
    const unsubscribe = useAuth.subscribe((state, prevState) => {
      if (state.isAuthenticated && !prevState.isAuthenticated) {
        void useProfile.getState().load({ force: true });
      } else if (!state.isAuthenticated && prevState.isAuthenticated) {
        useProfile.getState().reset();
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [loadUser]);

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  // Keep the splash up until auth + profile/preferences are loaded, so
  // currency and profile details are correct on the very first render.
  if (isSplashVisible || !isAppReady) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

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
          <Stack.Screen name="orders/[orderNumber]" />
          <Stack.Screen name="preferences" />
          <Stack.Screen name="ai-chat" />
          <Stack.Screen name="delivery-addresses" />
          <Stack.Screen name="payment-methods" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="support" />
          <Stack.Screen name="perfumes" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

