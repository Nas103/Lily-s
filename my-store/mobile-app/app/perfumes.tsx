import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productsAPI } from '../src/services/api';
import { Product, getCategoryName } from '../src/types';
import { useState, useEffect } from 'react';
import { useCart } from '../src/stores/cartStore';
import { useWishlist } from '../src/stores/wishlistStore';
import { useCurrency } from '../src/hooks/useCurrency';
import { Ionicons } from '@expo/vector-icons';
import GlowingGoldPrice from '../src/components/GlowingGoldPrice';
import AddToCartConfirmation from '../src/components/AddToCartConfirmation';
import WishlistConfirmation from '../src/components/WishlistConfirmation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 columns with padding

export default function PerfumesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { country } = useCurrency();
  const [menPerfumes, setMenPerfumes] = useState<Product[]>([]);
  const [womenPerfumes, setWomenPerfumes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState<string | null>(null);
  const [showWishlistConfirmation, setShowWishlistConfirmation] = useState<string | null>(null);

  useEffect(() => {
    loadPerfumes();
  }, [country]);

  const loadPerfumes = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll({ country: country || undefined, category: 'perfumes' });
      const products = data.products || data || [];
      
      // Filter and limit to 15 each
      const menProducts = products.filter((p: Product) => p.gender === 'men' || p.category === 'men').slice(0, 15);
      const womenProducts = products.filter((p: Product) => p.gender === 'women' || p.category === 'women').slice(0, 15);
      
      setMenPerfumes(menProducts);
      setWomenPerfumes(womenProducts);
    } catch (error: any) {
      console.error('Error loading perfumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.convertedPrice || product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    setShowAddToCartConfirmation(product.id);
  };

  const handleWishlistToggle = (product: Product, event: any) => {
    event?.stopPropagation?.();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      setShowWishlistConfirmation(product.id);
    }
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    const inWishlist = isInWishlist(product.id);
    const discountPercent = product.discountPercent || 0;
    const originalPrice = product.convertedPrice || product.price;
    const discountedPrice = discountPercent > 0 
      ? originalPrice * (1 - discountPercent / 100) 
      : originalPrice;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => handleProductPress(product)}
      >
        <View style={styles.productImageContainer}>
          {/* TODO: Replace with actual perfume product image */}
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={(e) => handleWishlistToggle(product, e)}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color={inWishlist ? '#ff4444' : '#ffffff'}
            />
          </TouchableOpacity>
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}
          <AddToCartConfirmation
            visible={showAddToCartConfirmation === product.id}
            onAnimationComplete={() => setShowAddToCartConfirmation(null)}
          />
          <WishlistConfirmation
            visible={showWishlistConfirmation === product.id}
            onAnimationComplete={() => setShowWishlistConfirmation(null)}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceContainer}>
            {discountPercent > 0 ? (
              <>
                <Text style={styles.productPriceOriginal}>
                  {product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                </Text>
                <GlowingGoldPrice
                  price={`${product.currencySymbol || '$'}${discountedPrice.toFixed(2)}`}
                  fontSize={16}
                  fontWeight="600"
                />
              </>
            ) : (
              <Text style={styles.productPrice}>
                {product.currencySymbol || '$'}{originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleQuickAdd(product)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfumes</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Loading perfumes...</Text>
        </View>
      ) : (
        <>
          {/* Men's Perfumes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For Men</Text>
            {menPerfumes.length > 0 ? (
              <FlatList
                data={menPerfumes}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.row}
              />
            ) : (
              <Text style={styles.emptyText}>No men's perfumes available</Text>
            )}
          </View>

          {/* Women's Perfumes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For Women</Text>
            {womenPerfumes.length > 0 ? (
              <FlatList
                data={womenPerfumes}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.row}
              />
            ) : (
              <Text style={styles.emptyText}>No women's perfumes available</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  productsGrid: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
  productInfo: {
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  priceContainer: {
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  productPriceOriginal: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    padding: 20,
  },
});

