import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { productsAPI } from '../../src/services/api';
import { Product, getCategoryName } from '../../src/types';
import { useState, useEffect } from 'react';
import { useCart } from '../../src/stores/cartStore';
import { useWishlist } from '../../src/stores/wishlistStore';
import { useCurrency } from '../../src/hooks/useCurrency';
import { Colors as ColorsImport } from '../../src/constants/colors';
import { Theme } from '../../src/constants/theme';
import ImageSlideshow from '../../src/components/ImageSlideshow';
import AddToCartConfirmation from '../../src/components/AddToCartConfirmation';
import WishlistConfirmation from '../../src/components/WishlistConfirmation';
import GlowingGoldPrice from '../../src/components/GlowingGoldPrice';
import LiquidMetalButton from '../../src/components/LiquidMetalButton';
import { Ionicons } from '@expo/vector-icons';

// Ensure Colors is available (fallback if import fails)
const Colors = ColorsImport || {
  background: '#ffffff',
  white: '#ffffff',
  black: '#000000',
  text: '#171717',
  textSecondary: '#52525b',
  textMuted: '#a1a1aa',
  border: '#e4e4e7',
  zinc: { 100: '#f4f4f5' },
};


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.45;

// Modern Abaya slideshow images - TODO: Replace URLs with your own images
const MODERN_ABAYA_IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80', // Image 1 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=2', // Image 2 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=3', // Image 3 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=4', // Image 4 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=5', // Image 5 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=6', // Image 6 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=7', // Image 7 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=8', // Image 8 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=9', // Image 9 - TODO: Replace with your abaya image
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80&v=10', // Image 10 - TODO: Replace with your abaya image
];

// Signature Perfumes slideshow images - TODO: Replace URLs with your own images
const SIGNATURE_PERFUMES_IMAGES = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', // Image 1 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=2', // Image 2 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=3', // Image 3 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=4', // Image 4 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=5', // Image 5 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=6', // Image 6 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=7', // Image 7 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=8', // Image 8 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=9', // Image 9 - TODO: Replace with your perfume image
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80&v=10', // Image 10 - TODO: Replace with your perfume image
];

// LifeStyle slideshow images
const LIFESTYLE_IMAGES = [
  'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ec3e98fb-387f-42b6-99b8-0cb6c65af835/LEBRON+TR+1.png', // Nike LeBron TR1
  'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/b2574131-f19e-4eeb-b967-bb7b31231155/NIKE+AIR+FORCE+1+%2707+LV8.png', // Nike Air Force 1 '07 LV8
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/0370d591-293f-472f-a049-d80f27b29834/KOBE+III+PROTRO.png', // Kobe III Protro
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/66ae15a0-0c20-4fae-9baa-60d212b13dc2/W+NIKE+MIND+001.png', // W Nike Mind 001
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/6135647d-4d7f-4b19-9e68-bca6fe443031/AIR+JORDAN+1+MID+SE.png', // Air Jordan 1 Mid SE
  'https://cdn.shopify.com/s/files/1/0267/2315/6143/files/s7.6008992-022_DEFAULT.png?width=350&height=490&crop=pad&pad_color=EAEAEA&width=400&height=500&crop=center', // Lifestyle shoe image 1
  'https://cdn.shopify.com/s/files/1/0267/2315/6143/files/s7.6006061-001_DEFAULT.png?width=350&height=490&crop=pad&pad_color=EAEAEA&width=400&height=500&crop=center', // Lifestyle shoe image 2
  'https://cdn.shopify.com/s/files/1/0267/2315/6143/files/s7.3027202-289_DEFAULT.png?width=350&height=490&crop=pad&pad_color=EAEAEA&width=400&height=500&crop=center', // Lifestyle shoe image 3
  'https://cdn.shopify.com/s/files/1/0267/2315/6143/files/s7.6008992-100_DEFAULT.png?width=350&height=490&crop=pad&pad_color=EAEAEA&width=400&height=500&crop=center', // Lifestyle shoe image 4
];

// Running slideshow images
const RUNNING_IMAGES = [
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/5cb0535c-ce52-45c3-bde1-8dad17e5022c/W+AIR+ZOOM+ALPHAFLY+NEXT%25+3.png', // W Air Zoom Alphafly Next% 3
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/b549a79f-4ddd-4f74-90a4-de75c16f89ee/W+ZOOMX+VAPORFLY+NEXT%25+4.png', // W ZoomX Vaporfly Next% 4
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/d7521756-f445-465c-a5bc-c44757f542fa/W+ZOOMX+VAPORFLY+NEXT%25+4.png', // W ZoomX Vaporfly Next% 4 (variant)
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/385e560b-38b3-4b23-8c23-cf5e83d39b5d/ZOOMX+VAPORFLY+NEXT%25+4.png', // ZoomX Vaporfly Next% 4
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/01a43078-dbf6-42ae-8415-0e2100f98d63/ZOOMX+VAPORFLY+NEXT%25+4+GLAM.png', // ZoomX Vaporfly Next% 4 Glam
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/2a3501e4-8829-47f1-a949-ef6ff5cb2fb9/AIR+ZOOM+ALPHAFLY+NEXT%25+3+PRM.png', // Air Zoom Alphafly Next% 3 PRM
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/b8bed037-4652-44e0-9731-12df98bd4240/ZOOMX+VAPORFLY+NEXT%25+4.png', // ZoomX Vaporfly Next% 4 (variant 2)
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/1c5a6736-9f34-4770-8f58-6b910bccf97a/ZOOM+FLY+6.png', // Zoom Fly 6
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/a1f54fc0-fb4f-43b3-8c17-b5bcb41abaf4/ZOOM+FLY+6.png', // Zoom Fly 6 (variant)
];

// BoxRaw Clothing slideshow images (10 images)
const BOXRAW_IMAGES = [
  'https://boxraw.com/cdn/shop/files/outspoken-desktop_35367bbf-f798-416b-bd64-08ab3fd95633_x1440.jpg?v=1760738489', // BoxRaw category theme image
  'https://boxraw.com/cdn/shop/files/Summer_Training_Wear-Homepage-Banner-Desktop-V1_0638bf9a-f245-440f-af57-5e2e05703c4a_x1440.jpg?v=1751011524', // Summer Training Wear
  'https://boxraw.com/cdn/shop/files/equipment-desktop_794b2abd-0019-41e7-b7b6-9cc7fa59478b_x1440.jpg?v=1680706592', // Equipment
  'https://boxraw.com/cdn/shop/files/bags-desktop--v1_x1440.jpg?v=1716558801', // Bags
  'https://cdn.shopify.com/s/files/1/1147/5966/files/photo_2023-11-06_14.57.48_1024x1024.jpg?v=1699282813', // BoxRaw photo
  'https://cdn.shopify.com/s/files/1/0019/4497/7466/files/outspoken-desktop-v2_x1900.jpg?v=1668614138', // Outspoken v2
  'https://cdn.shopify.com/s/files/1/1147/5966/files/BOXRAW-2023-Wallpaper-Logo-V2.jpg?v=1703157614', // BoxRaw Wallpaper Logo
  'https://boxraw.com/cdn/shop/files/Banner-Home-Desktop--v2_0928d3c4-5361-4c93-a7a1-cb178aef30b4_x1440.jpg?v=1691072239', // Banner Home Desktop
  'https://uk.boxraw.com/cdn/shop/articles/BOXRAW_Giftcard_bundle_16x9-1_600x.jpg?v=1702026402', // Giftcard Bundle
  'https://boxraw.com/cdn/shop/files/outspoken-desktop_35367bbf-f798-416b-bd64-08ab3fd95633_x1440.jpg?v=1760738489', // BoxRaw category theme image (duplicate for 10th image)
];

// Electronics slideshow images (10 images)
const ELECTRONICS_IMAGES = [
  'https://tse4.mm.bing.net/th/id/OIP.UkSrsasG5xwEm-dlTbrZLgHaEX?rs=1&pid=ImgDetMain&o=7&rm=3', // Electronics category theme image
  'https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg', // iPhone 17 Pro color lineup
  'https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-cosmic-orange-250909_inline.jpg.large_2x.jpg', // iPhone 17 Pro cosmic orange
  'https://static.digit.in/iPhone-17-Pro-Max-price-.png', // iPhone 17 Pro Max price
  'https://tse2.mm.bing.net/th/id/OIP.AsVf795eTtUkIQa1wXqAZAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', // Electronics image
  'https://techstory.in/wp-content/uploads/2024/05/Toms-Guide-3-750x375.png', // Tech story image
  'https://global.redmagic.gg/cdn/shop/files/images_view_4d866d8c-b37c-4717-9467-5c70389e443e.png?v=1761828552&width=960', // Red Magic product view
  'https://global.redmagic.gg/cdn/shop/files/image_6185a3f3-d48f-4f8a-a888-bc1b7833d900.jpg?v=1761828525', // Red Magic product image
  'https://global.redmagic.gg/cdn/shop/files/6f7d638e7d9add1f8852aa72aba8b206_1920x.png?v=1761828566', // Red Magic product banner
  'https://tse4.mm.bing.net/th/id/OIP.UkSrsasG5xwEm-dlTbrZLgHaEX?rs=1&pid=ImgDetMain&o=7&rm=3', // Electronics category theme image (duplicate for 10th image)
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { country } = useCurrency();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState<string | null>(null);
  const [showWishlistConfirmation, setShowWishlistConfirmation] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Pass country parameter to API to get currency-converted prices
      const data = await productsAPI.getAll({ country: country || undefined });
      const products = data.products || data || [];
      setFeaturedProducts(Array.isArray(products) ? products.slice(0, 6) : []);
    } catch (error: any) {
      console.error('Error loading products:', error);
      const errorMessage = error?.message || error?.response?.data?.error || 'Failed to load products';
      if (errorMessage.includes('Unable to connect') || errorMessage.includes('Network Error')) {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server.\n\nPlease check:\n1. Your Next.js backend is running\n2. API_BASE_URL in src/config/api.ts\n3. For physical devices, use your computer\'s IP address',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [country]); // Reload when country changes to apply currency conversion

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
    // Show confirmation animation
    setShowAddToCartConfirmation(product.id);
  };

  const handleWishlistToggle = (product: Product, event: any) => {
    event?.stopPropagation?.();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      // Show confirmation animation
      setShowWishlistConfirmation(product.id);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={[styles.hero, { paddingTop: insets.top + Theme.spacing.lg }]}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroTitleRow}>
            <View style={styles.brandNameContainer}>
              <Text style={styles.brandNameTop}>Lily</Text>
              <Text style={styles.brandNameBottom}>Atelier</Text>
            </View>
            <Image
              source={require('../../assets/home-icon.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </View>
          {/* TODO: Add comment here for product title editing */}
          <Text style={styles.heroSubtitle}>
            Up to 30% off curated drops
          </Text>
          <Text style={styles.heroDescription}>
            New textures, future silhouettes, and iconic perfumes. Your next
            statement fits land here first.
          </Text>
          <LiquidMetalButton
            theme="gold"
            textured={true}
            onPress={() => router.push('/(tabs)/categories')}
            style={styles.heroButton}
          >
            <Text style={[styles.heroButtonText, { color: '#FCD34D', fontWeight: '600', fontSize: 10, letterSpacing: 2 }]}>SHOP THE EDIT</Text>
          </LiquidMetalButton>
        </View>
      </LinearGradient>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>FEATURED ARRIVALS</Text>
            <Text style={styles.sectionTitle}>Fresh Kicks & Couture Layers</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.productsScroll}
            contentContainerStyle={styles.productsContainer}
          >
            {featuredProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const discountPercent = product.discountPercent || 0;
              const originalPrice = product.convertedPrice || product.price;
              const discountedPrice = discountPercent > 0 
                ? originalPrice * (1 - discountPercent / 100) 
                : originalPrice;
              
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    {/* Heart icon for wishlist */}
                    <TouchableOpacity
                      style={styles.wishlistButton}
                      onPress={(e) => handleWishlistToggle(product, e)}
                    >
                      <Ionicons
                        name={inWishlist ? 'heart' : 'heart-outline'}
                        size={24}
                        color={inWishlist ? '#ff4444' : '#ffffff'}
                      />
                    </TouchableOpacity>
                    {/* Discount badge */}
                    {discountPercent > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{discountPercent}%</Text>
                      </View>
                    )}
                    {/* Add to Cart Confirmation */}
                    <AddToCartConfirmation
                      visible={showAddToCartConfirmation === product.id}
                      onAnimationComplete={() => setShowAddToCartConfirmation(null)}
                    />
                    {/* Wishlist Confirmation */}
                    <WishlistConfirmation
                      visible={showWishlistConfirmation === product.id}
                      onAnimationComplete={() => setShowWishlistConfirmation(null)}
                    />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productCategory}>
                      {getCategoryName(product.category).toUpperCase()}
                    </Text>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.productFooter}>
                      <View style={styles.priceContainer}>
                        {discountPercent > 0 ? (
                          <>
                            <Text style={styles.productPriceOriginal}>
                              {product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                            </Text>
                            <Text style={styles.productPrice}>
                              {product.currencySymbol || '$'}{discountedPrice.toFixed(2)}
                            </Text>
                          </>
                        ) : (
                          <Text style={styles.productPrice}>
                            {product.currencySymbol || '$'}{originalPrice.toFixed(2)}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.quickAddButton}
                        onPress={() => handleQuickAdd(product)}
                      >
                        <Text style={styles.quickAddText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Category Tiles with Slideshow */}
      <View style={styles.categoriesSection}>
        <ImageSlideshow
          images={MODERN_ABAYA_IMAGES}
          label="MODERN ABAYA"
          title="Modern Abaya"
          subtitle="Architectural silhouettes and satin sheens."
          delay={3000}
          onPress={() => router.push('/(tabs)/categories?category=abaya')}
        />
        <ImageSlideshow
          images={SIGNATURE_PERFUMES_IMAGES}
          label="SIGNATURE PERFUMES"
          title="Signature Perfumes"
          subtitle="Layered oud, citrus, and amber accords."
          delay={3000}
          onPress={() => router.push('/perfumes')}
        />
        <ImageSlideshow
          images={LIFESTYLE_IMAGES}
          label="LIFESTYLE"
          title="LifeStyle"
          subtitle="Shoes from different brands for swag."
          delay={3000}
          onPress={() => router.push('/(tabs)/categories?category=lifestyle')}
        />
        <ImageSlideshow
          images={RUNNING_IMAGES}
          label="RUNNING"
          title="Running"
          subtitle="Performance running shoes for every stride."
          delay={3000}
          onPress={() => router.push('/(tabs)/categories?category=running')}
        />
        <ImageSlideshow
          images={BOXRAW_IMAGES}
          label="BOXRAW CLOTHING"
          title="BoxRaw Clothing"
          subtitle="Premium boxing apparel and equipment."
          delay={3000}
          onPress={() => router.push('/(tabs)/categories?category=boxraw')}
        />
        <ImageSlideshow
          images={ELECTRONICS_IMAGES}
          label="ELECTRONICS"
          title="Electronics"
          subtitle="Latest smartphones and tech devices."
          delay={3000}
          onPress={() => router.push('/(tabs)/categories?category=electronics')}
        />
      </View>
    </ScrollView>
  );
}

// CategoryTile component removed - now using ImageSlideshow component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
  },
  heroContent: {
    maxWidth: 400,
  },
  heroLabel: {
    fontSize: 10,
    letterSpacing: Theme.typography.letterSpacing.wider,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Theme.spacing.md,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  brandNameContainer: {
    flexDirection: 'column',
  },
  brandNameTop: {
    fontSize: 40,
    fontWeight: '300',
    color: Colors.white,
    lineHeight: 40,
  },
  brandNameBottom: {
    fontSize: 40,
    fontWeight: '300',
    color: Colors.white,
    lineHeight: 40,
  },
  heroTitle: {
    fontSize: 80,
    fontWeight: '300',
    color: Colors.white,
    lineHeight: 80,
  },
  homeIcon: {
    width: 180,
    height: 180,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '300',
    color: Colors.white,
    marginBottom: Theme.spacing.sm,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Theme.spacing.lg,
    lineHeight: 20,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: 10,
    letterSpacing: Theme.typography.letterSpacing.wide,
  },
  section: {
    padding: Theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: Theme.typography.letterSpacing.wide,
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 10,
    letterSpacing: Theme.typography.letterSpacing.wide,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Theme.spacing.sm,
  },
  productsScroll: {
    marginHorizontal: -24,
  },
  productsContainer: {
    paddingHorizontal: 24,
  },
  productCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    maxWidth: 200,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    maxHeight: 250,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Colors.zinc[100],
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
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
  productInfo: {
    marginTop: 12,
  },
  productCategory: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quickAddButton: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesSection: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
});

