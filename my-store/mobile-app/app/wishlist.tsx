import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../src/stores/wishlistStore';
import { useCart } from '../src/stores/cartStore';
import { getCategoryName } from '../src/types';
import { useCurrency } from '../src/hooks/useCurrency';
import AddToCartConfirmation from '../src/components/AddToCartConfirmation';
import GlowingGoldPrice from '../src/components/GlowingGoldPrice';
import { useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function WishlistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { country } = useCurrency();
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState<string | null>(null);

  const handleRemove = (productId: string, size?: string, color?: string) => {
    Alert.alert(
      'Remove from Wishlist',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(productId, size, color),
        },
      ]
    );
  };

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.product.id,
      name: item.product.name,
      price: item.product.convertedPrice || item.product.price,
      imageUrl: item.product.imageUrl,
      quantity: 1,
      size: item.size,
      color: item.color,
    });
    // Show confirmation animation
    setShowAddToCartConfirmation(item.product.id);
  };

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Wishlist</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Wishlist ({items.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {items.map((item, index) => {
            const discountPercent = item.product.discountPercent || 0;
            const originalPrice = item.product.convertedPrice || item.product.price;
            const discountedPrice = discountPercent > 0 
              ? originalPrice * (1 - discountPercent / 100) 
              : originalPrice;

            return (
              <View key={`${item.productId}-${item.size}-${item.color}-${index}`} style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => router.push(`/product/${item.productId}`)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.product.imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    {discountPercent > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{discountPercent}%</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemove(item.productId, item.size, item.color)}
                    >
                      <Ionicons name="heart" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productCategory}>
                      {getCategoryName(item.product.category).toUpperCase()}
                    </Text>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product.name}
                    </Text>
                    {item.size && (
                      <Text style={styles.productDetail}>Size: {item.size}</Text>
                    )}
                    {item.color && (
                      <Text style={styles.productDetail}>Color: {item.color}</Text>
                    )}
                    <View style={styles.priceContainer}>
                      {discountPercent > 0 ? (
                        <>
                          <Text style={styles.priceOriginal}>
                            {item.product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                          </Text>
                          <GlowingGoldPrice
                            price={`${item.product.currencySymbol || '$'}${discountedPrice.toFixed(2)}`}
                            fontSize={16}
                            fontWeight="600"
                          />
                        </>
                      ) : (
                        <Text style={styles.price}>
                          {item.product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#666666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  priceOriginal: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    margin: 12,
    marginTop: 0,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 14,
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
});
