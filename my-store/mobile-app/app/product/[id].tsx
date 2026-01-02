import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, Dimensions, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { productsAPI } from '../../src/services/api';
import { Product, getCategoryName, ColorImageSet, ProductImageAngle } from '../../src/types';
import { useCart } from '../../src/stores/cartStore';
import { useWishlist } from '../../src/stores/wishlistStore';
import { useCurrency } from '../../src/hooks/useCurrency';
import AddToCartConfirmation from '../../src/components/AddToCartConfirmation';
import WishlistConfirmation from '../../src/components/WishlistConfirmation';
import GlowingGoldPrice from '../../src/components/GlowingGoldPrice';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width;

// Image angle labels
const ANGLE_LABELS: Record<ProductImageAngle, string> = {
  front: 'Front',
  back: 'Back',
  side: 'Side',
  top: 'Top',
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedAngle, setSelectedAngle] = useState<ProductImageAngle>('front');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { country } = useCurrency();
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState(false);
  const [showWishlistConfirmation, setShowWishlistConfirmation] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id, country]);

  const loadProduct = async () => {
    try {
      const data = await productsAPI.getAll({ country: country || undefined });
      const found = data.products?.find((p: Product) => p.id === id);
      if (found) {
        setProduct(found);
        if (found.sizes && found.sizes.length > 0) {
          setSelectedSize(found.sizes[0]);
        }
        if (found.colors && found.colors.length > 0) {
          setSelectedColor(found.colors[0]);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id, selectedSize, selectedColor)) {
      removeFromWishlist(product.id, selectedSize, selectedColor);
    } else {
      addToWishlist(product, selectedSize, selectedColor);
      // Show confirmation animation
      setShowWishlistConfirmation(true);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.convertedPrice || product.price,
      imageUrl: product.imageUrl,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    // Show confirmation animation
    setShowAddToCartConfirmation(true);
  };

  // Get current image based on selected color and angle
  const getCurrentImage = (): string => {
    if (!product) return '';
    
    // If color is selected and has color images
    if (selectedColor && product.colorImages?.[selectedColor]) {
      const colorImageSet = product.colorImages[selectedColor];
      return colorImageSet[selectedAngle] || colorImageSet.front || product.imageUrl;
    }
    
    // Fallback to main image
    return product.imageUrl;
  };

  // Get image URL for a specific angle
  const getImageForAngle = (angle: ProductImageAngle): string => {
    if (!product) return '';
    
    if (selectedColor && product.colorImages?.[selectedColor]) {
      const colorImageSet = product.colorImages[selectedColor];
      return colorImageSet[angle] || colorImageSet.front || product.imageUrl;
    }
    
    return product.imageUrl;
  };

  // Get available angles for selected color
  const getAvailableAngles = (): ProductImageAngle[] => {
    if (!selectedColor || !product?.colorImages?.[selectedColor]) {
      return ['front']; // Default to front if no color images
    }
    // For electronics, only show front, back, side (3 images)
    if (product.category === 'electronics' || (typeof product.category === 'string' && product.category.toLowerCase() === 'electronics')) {
      return ['front', 'back', 'side'] as ProductImageAngle[];
    }
    // For other products, show all 4 angles
    return ['front', 'back', 'side', 'top'] as ProductImageAngle[];
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const availableAngles = getAvailableAngles();
  const currentImage = getCurrentImage();

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 16 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Wishlist Button */}
      <TouchableOpacity
        style={[styles.wishlistButton, { top: insets.top + 16, left: 16 }]}
        onPress={handleWishlistToggle}
      >
        <Ionicons
          name={isInWishlist(product.id, selectedSize, selectedColor) ? 'heart' : 'heart-outline'}
          size={28}
          color={isInWishlist(product.id, selectedSize, selectedColor) ? '#ff4444' : '#ffffff'}
        />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TODO: Add comment here for product images editing - support multiple images per color (side, front, back, top) */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: currentImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* Add to Cart Confirmation */}
          <AddToCartConfirmation
            visible={showAddToCartConfirmation}
            onAnimationComplete={() => setShowAddToCartConfirmation(false)}
          />
          {/* Wishlist Confirmation */}
          <WishlistConfirmation
            visible={showWishlistConfirmation}
            onAnimationComplete={() => setShowWishlistConfirmation(false)}
          />
        </View>

        {/* Image thumbnails (only show if color is selected and has multiple angles) */}
        {selectedColor && product.colorImages?.[selectedColor] && availableAngles.length > 1 && (
          <View style={styles.thumbnailContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.thumbnailContent}
            >
              {availableAngles.map((angle) => {
                const thumbnailImage = getImageForAngle(angle);
                return (
                  <TouchableOpacity
                    key={angle}
                    style={[
                      styles.thumbnailButton,
                      selectedAngle === angle && styles.thumbnailButtonSelected,
                    ]}
                    onPress={() => setSelectedAngle(angle)}
                  >
                    <Image
                      source={{ uri: thumbnailImage }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                    {selectedAngle === angle && (
                      <View style={styles.thumbnailOverlay}>
                        <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

      <View style={styles.content}>
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        <Text style={styles.category}>
          {getCategoryName(product.category).toUpperCase()}
        </Text>
        {/* TODO: Add comment here for product title editing */}
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.priceContainer}>
          {product.discountPercent && product.discountPercent > 0 ? (
            <>
              <Text style={styles.priceOriginal}>
                {product.currencySymbol || '$'}{(product.convertedPrice || product.price).toFixed(2)}
              </Text>
              <GlowingGoldPrice
                price={`${product.currencySymbol || '$'}${((product.convertedPrice || product.price) * (1 - product.discountPercent / 100)).toFixed(2)}`}
                fontSize={24}
                fontWeight="600"
              />
            </>
          ) : (
            <Text style={styles.price}>
              {product.currencySymbol || '$'}{(product.convertedPrice || product.price).toFixed(2)}
            </Text>
          )}
        </View>

        {product.highlight && (
          <Text style={styles.highlight}>{product.highlight}</Text>
        )}

        <Text style={styles.description}>{product.description}</Text>

        {product.sizes && product.sizes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.optionsContainer}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    selectedSize === size && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSize === size && styles.optionTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {product.colors && product.colors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.optionsContainer}>
              {product.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionButton,
                    selectedColor === color && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedColor(color);
                    setSelectedAngle('front'); // Reset to front when color changes
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedColor === color && styles.optionTextSelected,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageContainer: {
    position: 'relative',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  productImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#f5f5f5',
  },
  thumbnailContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#ffffff',
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  thumbnailButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailButtonSelected: {
    borderColor: '#000000',
    borderWidth: 3,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  category: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#666666',
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  priceOriginal: {
    fontSize: 20,
    fontWeight: '400',
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  wishlistButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  highlight: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
  },
  optionButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#000000',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
