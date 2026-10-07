import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ordersAPI } from '../../src/services/api';

type OrderItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
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
  subtotal: number;
  shipping: number;
  total: number;
  trackingNumber?: string | null;
  createdAt: string;
  shippingName?: string | null;
  shippingAddressLine1?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostcode?: string | null;
  shippingCountry?: string | null;
  orderItems: OrderItem[];
};

const STEPS = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderNumber) return;
    try {
      setError(null);
      const data = await ordersAPI.get(orderNumber);
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order not found');
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const currentStep =
    order && order.status !== 'CANCELLED' && order.status !== 'FAILED'
      ? STEPS.indexOf(order.status)
      : -1;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {order ? order.orderNumber : 'Order'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#000000" />
        </View>
      ) : error || !order ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
          <Text style={styles.date}>
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </Text>

          {currentStep >= 0 ? (
            <View style={styles.steps}>
              {STEPS.map((step, index) => (
                <View key={step} style={styles.step}>
                  <View
                    style={[
                      styles.dot,
                      index <= currentStep ? styles.dotActive : styles.dotInactive,
                    ]}
                  >
                    {index <= currentStep && (
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    )}
                  </View>
                  <Text style={styles.stepLabel}>{step}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.cancelled}>
              <Text style={styles.cancelledText}>
                This order was {order.status.toLowerCase()}.
              </Text>
            </View>
          )}

          {order.trackingNumber ? (
            <Text style={styles.tracking}>
              Tracking number: {order.trackingNumber}
            </Text>
          ) : null}

          <View style={styles.section}>
            {order.orderItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemImage}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  ) : null}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    Qty {item.quantity}
                    {item.size ? ` · Size ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  R{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>R{order.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping</Text>
                <Text style={styles.totalValue}>R{order.shipping.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.grandLabel}>Total</Text>
                <Text style={styles.grandValue}>R{order.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {order.shippingAddressLine1 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shipping to</Text>
              <Text style={styles.address}>{order.shippingName}</Text>
              <Text style={styles.address}>{order.shippingAddressLine1}</Text>
              <Text style={styles.address}>
                {[order.shippingCity, order.shippingState, order.shippingPostcode]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
              <Text style={styles.address}>{order.shippingCountry}</Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: { fontSize: 16, fontWeight: '600', color: '#000000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorText: { color: '#b91c1c', textAlign: 'center' },
  content: { padding: 16, gap: 16 },
  date: { fontSize: 13, color: '#737373' },
  steps: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { flex: 1, alignItems: 'center', gap: 6 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: { backgroundColor: '#000000', borderColor: '#000000' },
  dotInactive: { borderColor: '#d4d4d4', backgroundColor: '#ffffff' },
  stepLabel: { fontSize: 9, color: '#737373', textAlign: 'center' },
  cancelled: {
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
  },
  cancelledText: { color: '#b91c1c', fontSize: 14 },
  tracking: { fontSize: 14, color: '#404040' },
  section: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#f4f4f5',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#000000' },
  itemMeta: { fontSize: 12, color: '#737373', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#000000' },
  totals: {
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    paddingTop: 12,
    gap: 4,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 13, color: '#525252' },
  totalValue: { fontSize: 13, color: '#525252' },
  grandLabel: { fontSize: 15, fontWeight: '700', color: '#000000' },
  grandValue: { fontSize: 15, fontWeight: '700', color: '#000000' },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#737373',
    textTransform: 'uppercase',
  },
  address: { fontSize: 13, color: '#404040' },
});