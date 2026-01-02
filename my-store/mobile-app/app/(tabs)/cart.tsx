import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../src/stores/cartStore';
import { recommendationsAPI, productsAPI } from '../../src/services/api';
import { Product, getCategoryName } from '../../src/types';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCurrency } from '../../src/hooks/useCurrency';
import AddToCartConfirmation from '../../src/components/AddToCartConfirmation';
import GlowingGoldPrice from '../../src/components/GlowingGoldPrice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, removeItem, updateQuantity, total, clearCart, addItem } = useCart();
  const { country } = useCurrency();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState<string | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart first.');
      return;
    }
    router.push('/checkout');
  };

  useEffect(() => {
    if (items.length > 0) {
      loadRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [items, country]);

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      
      // Get product details for cart items to extract categories
      const cartItemIds = items.map(item => item.id);
      const allProductsResponse = await productsAPI.getAll({ country });
      const allProducts = allProductsResponse.products || [];
      
      // Map cart items with their product details
      const cartItemsWithDetails = items.map(cartItem => {
        const product = allProducts.find(p => p.id === cartItem.id);
        return {
          ...cartItem,
          category: product?.category || 'other',
        };
      });
      
      // Get recommendations with limit of 5
      const data = await recommendationsAPI.getRecommendations(cartItemsWithDetails, 10);
      let recommendedProducts = data.recommendations || [];
      
      // Filter out items already in cart
      const cartItemIdsSet = new Set(cartItemIds);
      recommendedProducts = recommendedProducts.filter(
        (product: Product) => !cartItemIdsSet.has(product.id)
      );
      
      // Limit to 5 items
      recommendedProducts = recommendedProducts.slice(0, 5);
      
      setRecommendations(recommendedProducts);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Fallback: try to get products from same categories
      try {
        const cartItemIds = items.map(item => item.id);
        const allProductsResponse = await productsAPI.getAll({ country });
        const allProducts = allProductsResponse.products || [];
        
        // Get unique categories from cart items (if we can infer them)
        // For now, just get random products excluding cart items
        const cartItemIdsSet = new Set(cartItemIds);
        const filteredProducts = allProducts
          .filter((product: Product) => !cartItemIdsSet.has(product.id))
          .slice(0, 5);
        
        setRecommendations(filteredProducts);
      } catch (fallbackError) {
        console.error('Error in fallback recommendations:', fallbackError);
        setRecommendations([]);
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleRemove = (id: string, size?: string, color?: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(id, size, color),
        },
      ]
    );
  };

  // Get currency symbol based on country
  const getCurrencySymbol = () => {
    if (country === 'ZA') return 'R';
    if (country === 'GB') return '£';
    if (country === 'EU' || (country && ['FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'GR'].includes(country))) return '€';
    if (country === 'JP') return '¥';
    if (country === 'CN') return '¥';
    if (country === 'IN') return '₹';
    return '$';
  };

  const currencySymbol = getCurrencySymbol();

  const handleAddRecommendedToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.convertedPrice || product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    // Show confirmation animation
    setShowAddToCartConfirmation(product.id);
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Ionicons name="bag-outline" size={64} color="#cccccc" />
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}>
        {items.map((item, index) => (
          <View key={`${item.id}-${item.size}-${item.color}-${index}`} style={styles.cartItem}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.size && (
                <Text style={styles.itemDetail}>Size: {item.size}</Text>
              )}
              {item.color && (
                <Text style={styles.itemDetail}>Color: {item.color}</Text>
              )}
              <Text style={styles.itemPrice}>
                {currencySymbol}{item.price.toFixed(2)} each
              </Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1, item.size, item.color);
                    }
                  }}
                >
                  <Ionicons name="remove" size={20} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    updateQuantity(item.id, item.quantity + 1, item.size, item.color);
                  }}
                >
                  <Ionicons name="add" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemActions}>
              <Text style={styles.itemTotal}>
                {currencySymbol}{(item.price * item.quantity).toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.id, item.size, item.color)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Recommendations Section */}
        {items.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.recommendationsTitle}>You May Also Like</Text>
            {loadingRecommendations ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#000000" />
              </View>
            ) : recommendations.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendationsContainer}
              >
                {recommendations.map((product) => {
                  const discountPercent = product.discountPercent || 0;
                  const originalPrice = product.convertedPrice || product.price;
                  const discountedPrice = discountPercent > 0 
                    ? originalPrice * (1 - discountPercent / 100) 
                    : originalPrice;

                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.recommendedProductCard}
                      onPress={() => router.push(`/product/${product.id}`)}
                    >
                      <View style={styles.recommendedImageContainer}>
                        <Image
                          source={{ uri: product.imageUrl }}
                          style={styles.recommendedImage}
                          resizeMode="cover"
                        />
                        {discountPercent > 0 && (
                          <View style={styles.recommendedDiscountBadge}>
                            <Text style={styles.recommendedDiscountText}>-{discountPercent}%</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.recommendedProductInfo}>
                        <Text style={styles.recommendedProductName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <View style={styles.recommendedPriceContainer}>
                          {discountPercent > 0 ? (
                            <>
                              <Text style={styles.recommendedPriceOriginal}>
                                {product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                              </Text>
                              <GlowingGoldPrice
                                price={`${product.currencySymbol || '$'}${discountedPrice.toFixed(2)}`}
                                fontSize={16}
                                fontWeight="600"
                              />
                            </>
                          ) : (
                            <Text style={styles.recommendedPrice}>
                              {product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.recommendedAddButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddRecommendedToCart(product);
                          }}
                        >
                          <Text style={styles.recommendedAddButtonText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Cart Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{currencySymbol}{total().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Calculated at checkout</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{currencySymbol}{total().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 200,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: Math.min(100, SCREEN_WIDTH * 0.25),
    height: Math.min(100, SCREEN_WIDTH * 0.25),
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
  },
  summary: {
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  checkoutButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
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
    marginTop: 16,
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
  recommendationsSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  recommendationsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  recommendedProductCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedDiscountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedDiscountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  recommendedProductInfo: {
    padding: 12,
  },
  recommendedProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    minHeight: 40,
  },
  recommendedPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  recommendedPriceOriginal: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  recommendedAddButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  recommendedAddButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

