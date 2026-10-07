import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/stores/authStore';
import { ordersAPI } from '../src/services/api';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
  trackingNumber?: string | null;
  orderItems: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#b45309',
  PAID: '#1d4ed8',
  PROCESSING: '#4338ca',
  SHIPPED: '#7e22ce',
  DELIVERED: '#047857',
  CANCELLED: '#525252',
  FAILED: '#b91c1c',
};

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await ordersAPI.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please sign in to view your orders</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Header onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <ActivityIndicator color="#000000" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onBack={() => router.back()} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          orders.length
            ? [styles.listContent, { paddingBottom: insets.bottom + 40 }]
            : [styles.emptyContainer, { paddingBottom: insets.bottom + 40 }]
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyInner}>
            <Ionicons name="bag-outline" size={64} color="#cccccc" />
            <Text style={styles.emptyText}>
              {error || 'No orders yet'}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <Text style={styles.primaryButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/orders/${item.orderNumber}`)}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString()} ·{' '}
                  {item.orderItems.length} item
                  {item.orderItems.length === 1 ? '' : 's'}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { borderColor: STATUS_COLORS[item.status] || '#b45309' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: STATUS_COLORS[item.status] || '#b45309' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.total}>
              R{item.total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.title}>Orders</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyInner: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  orderDate: {
    fontSize: 12,
    color: '#737373',
    marginTop: 2,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  total: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  primaryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});