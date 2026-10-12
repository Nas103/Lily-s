import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../src/stores/cartStore';
import { useAuth } from '../src/stores/authStore';
import { useState, useEffect } from 'react';
import { deliveryAddressesAPI, stripeAPI } from '../src/services/api';
import { useStripe } from '@stripe/stripe-react-native';
import { DeliveryAddress, PaymentMethod } from '../src/types';
import { Ionicons } from '@expo/vector-icons';
import { useCurrency } from '../src/hooks/useCurrency';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { symbol } = useCurrency();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
      loadPaymentMethods();
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      const data = await deliveryAddressesAPI.getAll();
      const addressList = Array.isArray(data) ? data : [];
      setAddresses(addressList);
      const defaultAddress = addressList.find((a: DeliveryAddress) => a.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const { paymentMethodsAPI } = await import('../src/services/api');
      const data = await paymentMethodsAPI.getAll();
      const methodList = Array.isArray(data) ? data : [];
      setPaymentMethods(methodList);
      const defaultMethod = methodList.find((m: PaymentMethod) => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to complete your purchase', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login') },
      ]);
      return;
    }

    if (!selectedAddress) {
      Alert.alert('Select Address', 'Please select a delivery address');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty');
      return;
    }

    try {
      setLoading(true);

      // Cart prices are display-only; the server re-resolves each item's price
      // from the catalog and computes the charge amount itself.
      const checkoutItems = items.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      // 1. Create a PaymentIntent on the server and get the client secret.
      const { clientSecret, orderNumber } = await stripeAPI.createPaymentIntent(
        checkoutItems,
        selectedAddress
      );

      if (!clientSecret) {
        throw new Error('Missing payment client secret');
      }

      // 2. Initialise the Stripe Payment Sheet.
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'NaSO',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        returnURL: 'naso://stripe-redirect',
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // 3. Present the sheet and complete the payment.
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        // Shopper dismissed the sheet — keep the cart intact.
        if (presentError.code === 'Canceled') {
          return;
        }
        throw new Error(presentError.message);
      }

      clearCart();
      Alert.alert(
        'Payment Successful',
        `Thank you! Your order ${orderNumber} has been paid. A confirmation email is on its way.`,
        [{ text: 'View Orders', onPress: () => router.replace('/orders') }]
      );
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.error || error?.message || 'Failed to process checkout. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push('/(tabs)/categories')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {!isAuthenticated ? (
            <TouchableOpacity
              style={styles.signInPrompt}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.signInText}>Sign in to select address</Text>
            </TouchableOpacity>
          ) : addresses.length === 0 ? (
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => router.push('/delivery-addresses')}
            >
              <Ionicons name="add-circle-outline" size={24} color="#000000" />
              <Text style={styles.addAddressText}>Add Delivery Address</Text>
            </TouchableOpacity>
          ) : (
            addresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.addressCard,
                  selectedAddress === address.id && styles.addressCardSelected,
                ]}
                onPress={() => setSelectedAddress(address.id)}
              >
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </View>
                <Text style={styles.addressText}>{address.fullName}</Text>
                <Text style={styles.addressText}>{address.addressLine1}</Text>
                {address.addressLine2 && (
                  <Text style={styles.addressText}>{address.addressLine2}</Text>
                )}
                <Text style={styles.addressText}>
                  {address.city}, {address.state || ''} {address.postcode}
                </Text>
                <Text style={styles.addressText}>{address.country}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Payment Method */}
        {isAuthenticated && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {paymentMethods.length === 0 ? (
              <TouchableOpacity
                style={styles.addPaymentButton}
                onPress={() => router.push('/payment-methods')}
              >
                <Ionicons name="add-circle-outline" size={24} color="#000000" />
                <Text style={styles.addPaymentText}>Add Payment Method</Text>
              </TouchableOpacity>
            ) : (
              <>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentCard,
                      selectedPaymentMethod === method.id && styles.paymentCardSelected,
                    ]}
                    onPress={() => setSelectedPaymentMethod(method.id)}
                  >
                    <View style={styles.paymentHeader}>
                      <Ionicons
                        name={method.type === 'CARD' ? 'card' : 'wallet-outline'}
                        size={24}
                        color="#000000"
                      />
                      <View style={styles.paymentInfo}>
                        {method.type === 'CARD' && method.cardBrand && (
                          <Text style={styles.paymentBrand}>{method.cardBrand.toUpperCase()}</Text>
                        )}
                        {method.type === 'CARD' && method.cardLast4 && (
                          <Text style={styles.paymentNumber}>
                            •••• •••• •••• {method.cardLast4}
                          </Text>
                        )}
                        {method.holderName && (
                          <Text style={styles.paymentName}>{method.holderName}</Text>
                        )}
                      </View>
                      {method.isDefault && (
                        <Text style={styles.defaultBadge}>Default</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.payfastOption}
                  onPress={() => setSelectedPaymentMethod('payfast')}
                >
                  <View style={[
                    styles.paymentCard,
                    selectedPaymentMethod === 'payfast' && styles.paymentCardSelected,
                  ]}>
                    <View style={styles.paymentHeader}>
                      <Ionicons name="card-outline" size={24} color="#000000" />
                      <View style={styles.paymentInfo}>
                        <Text style={styles.paymentBrand}>PayFast</Text>
                        <Text style={styles.paymentNumber}>Pay with card, EFT, or instant EFT</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemDetails}>
                Qty: {item.quantity} × {symbol}{item.price.toFixed(2)}
              </Text>
              <Text style={styles.orderItemTotal}>
                {symbol}{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{symbol}{total().toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>Calculated at checkout</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>{symbol}{total().toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutFooter}>
        <TouchableOpacity
          style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          <Text style={styles.checkoutButtonText}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  signInPrompt: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#666666',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    gap: 8,
  },
  addAddressText: {
    fontSize: 14,
    color: '#000000',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    gap: 8,
  },
  addPaymentText: {
    fontSize: 14,
    color: '#000000',
  },
  addressCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 12,
  },
  addressCardSelected: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  paymentCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentCardSelected: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  paymentName: {
    fontSize: 14,
    color: '#000000',
  },
  defaultBadge: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  payfastOption: {
    marginTop: 8,
  },
  orderItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
  },
  totalValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    padding: 16,
    paddingBottom: 32,
  },
  checkoutButton: {
    backgroundColor: '#000000',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
