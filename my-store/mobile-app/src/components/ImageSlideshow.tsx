import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ImageSlideshowProps = {
  images: string[]; // Array of image URLs
  title: string;
  subtitle: string;
  label?: string;
  delay?: number; // Delay between slides in milliseconds
  onPress?: () => void;
};

export default function ImageSlideshow({
  images,
  title,
  subtitle,
  label,
  delay = 3000,
  onPress,
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const containerWidth = SCREEN_WIDTH - 48; // Account for padding (24px on each side)
  const isAnimating = useRef(false);

  // Preload all images to prevent flickering
  useEffect(() => {
    const preloadImages = async () => {
      // Preload all images in the array
      for (const uri of images) {
        try {
          await Image.prefetch(uri);
        } catch (error) {
          // Silently fail - image will load normally
        }
      }
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (isAnimating.current) return; // Skip if already animating
      
      const nextIndex = (currentIndex + 1) % images.length;
      isAnimating.current = true;
      
      // Smooth slide transition: current slides left, next slides in from right
      Animated.timing(slideAnim, {
        toValue: -containerWidth,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Reset position and update index
        setCurrentIndex(nextIndex);
        slideAnim.setValue(0);
        isAnimating.current = false;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [images.length, delay, slideAnim, currentIndex, containerWidth]);

  const nextIndex = (currentIndex + 1) % images.length;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.imageWrapper} pointerEvents="box-none">
        {/* Current image sliding out to the left */}
        <Animated.View 
          style={[
            styles.imageContainer, 
            { 
              transform: [{ translateX: slideAnim }],
              width: containerWidth,
            }
          ]}
        >
          <Image
            source={{ uri: images[currentIndex] }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />
        </Animated.View>
        
        {/* Next image sliding in from the right */}
        {images.length > 1 && (
          <Animated.View 
            style={[
              styles.imageContainer,
              { 
                transform: [{ 
                  translateX: slideAnim.interpolate({
                    inputRange: [-containerWidth, 0],
                    outputRange: [0, containerWidth],
                  })
                }],
                width: containerWidth,
              }
            ]}
          >
            <Image
              source={{ uri: images[nextIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            />
          </Animated.View>
        )}
      </View>
      
      {/* Floating text content */}
      <View style={styles.textContainer} pointerEvents="none">
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nextImageContainer: {
    // Next image starts from the right - will be positioned via transform
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5', // Placeholder background while loading
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    zIndex: 10,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

