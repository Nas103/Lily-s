import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { productsAPI } from '../../src/services/api';
import { Product, getCategoryName } from '../../src/types';
import { useCart } from '../../src/stores/cartStore';
import { useWishlist } from '../../src/stores/wishlistStore';
import { useCurrency } from '../../src/hooks/useCurrency';
import AddToCartConfirmation from '../../src/components/AddToCartConfirmation';
import WishlistConfirmation from '../../src/components/WishlistConfirmation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 16) / 2; // 2 columns with padding (16px each side) and 16px gap between columns

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { country } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  // Initialize subCategory based on initial category
  const getInitialSubCategory = (cat: string | undefined) => {
    if (cat === 'boxraw') return 'clothing';
    if (cat === 'electronics') return 'apple';
    return 'clothing'; // Default
  };
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(getInitialSubCategory(category));
  const [previousCategory, setPreviousCategory] = useState<string>(category || 'all');
  const [showAddToCartConfirmation, setShowAddToCartConfirmation] = useState<string | null>(null);
  const [showWishlistConfirmation, setShowWishlistConfirmation] = useState<string | null>(null);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'men', label: "Men's" },
    { id: 'women', label: "Women's" },
    { id: 'abaya', label: 'Abaya' },
    { id: 'perfumes', label: 'Perfumes' },
    { id: 'lifestyle', label: 'LifeStyle' },
    { id: 'running', label: 'Running' },
    { id: 'boxraw', label: 'BoxRaw' },
    { id: 'electronics', label: 'Electronics' },
  ];

  // Sync selectedCategory with URL parameter when it changes
  useEffect(() => {
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
      // Also update subCategory when category changes from URL
      if (category === 'boxraw') {
        setSelectedSubCategory('clothing');
      } else if (category === 'electronics') {
        setSelectedSubCategory('apple');
      }
    }
  }, [category]);

  useEffect(() => {
    // Reset subCategory only when switching between different categories
    if (previousCategory !== selectedCategory) {
      if (selectedCategory === 'boxraw') {
        setSelectedSubCategory('clothing');
      } else if (selectedCategory === 'electronics') {
        setSelectedSubCategory('apple');
      }
      setPreviousCategory(selectedCategory);
    }
  }, [selectedCategory, previousCategory]);

  useEffect(() => {
    // Load products when category, subCategory, or country changes
    // Ensure subCategory is set correctly for electronics and boxraw before loading
    if (selectedCategory === 'electronics') {
      // If subCategory is not one of the valid electronics sub-categories, set to 'apple'
      if (selectedSubCategory !== 'apple' && selectedSubCategory !== 'samsung' && selectedSubCategory !== 'flagship') {
        setSelectedSubCategory('apple');
        return; // Wait for subCategory to update before loading
      }
    } else if (selectedCategory === 'boxraw') {
      // If subCategory is not one of the valid boxraw sub-categories, set to 'clothing'
      if (selectedSubCategory !== 'clothing' && selectedSubCategory !== 'equipment') {
        setSelectedSubCategory('clothing');
        return; // Wait for subCategory to update before loading
      }
    }
    loadProducts();
  }, [selectedCategory, selectedSubCategory, country]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: { category?: string; subCategory?: string; country?: string } = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
        // Add subCategory for BoxRaw and Electronics
        if (selectedCategory === 'boxraw' || selectedCategory === 'electronics') {
          // Ensure we have a valid subCategory for these categories
          let validSubCategory = selectedSubCategory;
          if (selectedCategory === 'electronics') {
            // If subCategory is not valid for electronics, default to 'apple'
            if (selectedSubCategory !== 'apple' && selectedSubCategory !== 'samsung' && selectedSubCategory !== 'flagship') {
              validSubCategory = 'apple';
              setSelectedSubCategory('apple'); // Update state for next render
            }
          } else if (selectedCategory === 'boxraw') {
            // If subCategory is not valid for boxraw, default to 'clothing'
            if (selectedSubCategory !== 'clothing' && selectedSubCategory !== 'equipment') {
              validSubCategory = 'clothing';
              setSelectedSubCategory('clothing'); // Update state for next render
            }
          }
          params.subCategory = validSubCategory;
        }
      }
      if (country) {
        params.country = country;
      }
      const data = await productsAPI.getAll(params);
      const products = data.products || data || [];
      setProducts(Array.isArray(products) ? products : []);
    } catch (error: any) {
      console.error('Error loading products:', error);
      const errorMessage = error?.message || error?.response?.data?.error || 'Failed to load products';
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = (product: Product, event?: any) => {
    event?.stopPropagation?.();
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

  const handleWishlistToggle = (product: Product, event?: any) => {
    event?.stopPropagation?.();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      setShowWishlistConfirmation(product.id);
    }
  };

  // Render product card
  const renderProduct = (item: Product) => {
    const inWishlist = isInWishlist(item.id);
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.productCard}
        onPress={() => handleProductPress(item)}
      >
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* Wishlist heart button */}
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={(e) => handleWishlistToggle(item, e)}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color={inWishlist ? '#ff4444' : '#ffffff'}
            />
          </TouchableOpacity>
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          {/* Add to Cart Confirmation */}
          <AddToCartConfirmation
            visible={showAddToCartConfirmation === item.id}
            onAnimationComplete={() => setShowAddToCartConfirmation(null)}
          />
          {/* Wishlist Confirmation */}
          <WishlistConfirmation
            visible={showWishlistConfirmation === item.id}
            onAnimationComplete={() => setShowWishlistConfirmation(null)}
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>
            {getCategoryName(item.category).toUpperCase()}
          </Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>
            {item.currencySymbol || '$'}{(item.convertedPrice || item.price).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => handleQuickAdd(item, e)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Filter products by gender for running category
  const menProducts = selectedCategory === 'running' 
    ? products.filter(p => p.gender === 'men').slice(0, 10)
    : [];
  const womenProducts = selectedCategory === 'running'
    ? products.filter(p => p.gender === 'women').slice(0, 10)
    : [];

  // Filter products by subCategory for BoxRaw category
  const boxrawClothingProducts = selectedCategory === 'boxraw'
    ? products.filter(p => p.subCategory === 'clothing')
    : [];
  const boxrawEquipmentProducts = selectedCategory === 'boxraw'
    ? products.filter(p => p.subCategory === 'equipment')
    : [];

  // Filter products by subCategory for Electronics category
  // Since API already filters by subCategory, use products directly from API response
  const electronicsAppleProducts = selectedCategory === 'electronics' && selectedSubCategory === 'apple'
    ? products
    : [];
  const electronicsSamsungProducts = selectedCategory === 'electronics' && selectedSubCategory === 'samsung'
    ? products
    : [];
  const electronicsFlagshipProducts = selectedCategory === 'electronics' && selectedSubCategory === 'flagship'
    ? products
    : [];

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={[styles.categoryFilterContent, { paddingTop: insets.top + 8 }]}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat.id && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sub-Category Filter for BoxRaw */}
      {selectedCategory === 'boxraw' && (
        <View style={styles.subCategoryFilter}>
          <TouchableOpacity
            style={[
              styles.subCategoryButton,
              selectedSubCategory === 'clothing' && styles.subCategoryButtonActive,
            ]}
            onPress={() => setSelectedSubCategory('clothing')}
          >
            <Text
              style={[
                styles.subCategoryButtonText,
                selectedSubCategory === 'clothing' && styles.subCategoryButtonTextActive,
              ]}
            >
              Clothing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subCategoryButton,
              selectedSubCategory === 'equipment' && styles.subCategoryButtonActive,
            ]}
            onPress={() => setSelectedSubCategory('equipment')}
          >
            <Text
              style={[
                styles.subCategoryButtonText,
                selectedSubCategory === 'equipment' && styles.subCategoryButtonTextActive,
              ]}
            >
              Equipment
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sub-Category Filter for Electronics */}
      {selectedCategory === 'electronics' && (
        <View style={styles.subCategoryFilter}>
          <TouchableOpacity
            style={[
              styles.subCategoryButton,
              selectedSubCategory === 'apple' && styles.subCategoryButtonActive,
            ]}
            onPress={() => setSelectedSubCategory('apple')}
          >
            <Text
              style={[
                styles.subCategoryButtonText,
                selectedSubCategory === 'apple' && styles.subCategoryButtonTextActive,
              ]}
            >
              Apple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subCategoryButton,
              selectedSubCategory === 'samsung' && styles.subCategoryButtonActive,
            ]}
            onPress={() => setSelectedSubCategory('samsung')}
          >
            <Text
              style={[
                styles.subCategoryButtonText,
                selectedSubCategory === 'samsung' && styles.subCategoryButtonTextActive,
              ]}
            >
              Samsung
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subCategoryButton,
              selectedSubCategory === 'flagship' && styles.subCategoryButtonActive,
            ]}
            onPress={() => setSelectedSubCategory('flagship')}
          >
            <Text
              style={[
                styles.subCategoryButtonText,
                selectedSubCategory === 'flagship' && styles.subCategoryButtonTextActive,
              ]}
            >
              Flagship
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : selectedCategory === 'running' ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.runningContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* MEN Section */}
          <View style={styles.genderSection}>
            <Text style={styles.genderHeading}>MEN</Text>
            <FlatList
              data={menProducts}
              numColumns={2}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.runningProductsGridContainer}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => renderProduct(item)}
            />
          </View>

          {/* WOMEN Section */}
          <View style={styles.genderSection}>
            <Text style={styles.genderHeading}>WOMEN</Text>
            <FlatList
              data={womenProducts}
              numColumns={2}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.runningProductsGridContainer}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => renderProduct(item)}
            />
          </View>
        </ScrollView>
      ) : selectedCategory === 'boxraw' ? (
        <FlatList
          data={selectedSubCategory === 'clothing' ? boxrawClothingProducts : boxrawEquipmentProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => renderProduct(item)}
        />
      ) : selectedCategory === 'electronics' ? (
        <FlatList
          data={
            selectedSubCategory === 'apple' ? electronicsAppleProducts :
            selectedSubCategory === 'samsung' ? electronicsSamsungProducts :
            selectedSubCategory === 'flagship' ? electronicsFlagshipProducts :
            products // Fallback to all products
          }
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => renderProduct(item)}
          ListEmptyComponent={
            loading ? null : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 16 }}>No products found</Text>
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => renderProduct(item)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  categoryFilter: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    maxHeight: 80,
  },
  categoryFilterContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 12,
    alignItems: 'center',
  },
  subCategoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    gap: 12,
  },
  subCategoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minHeight: 40,
    justifyContent: 'center',
  },
  subCategoryButtonActive: {
    backgroundColor: '#000000',
  },
  subCategoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  subCategoryButtonTextActive: {
    color: '#ffffff',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minHeight: 40,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#000000',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  runningContainer: {
    paddingBottom: 32,
  },
  genderSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  genderHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  runningProductsGridContainer: {
    paddingBottom: 8,
  },
  productsGrid: {
    padding: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    maxHeight: 300,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#666666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
});

