import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity, Easing } from 'react-native';
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

const TRANSITION_DURATION = 700;

export default function ImageSlideshow({
  images,
  title,
  subtitle,
  label,
  delay = 3000,
  onPress,
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerWidth = SCREEN_WIDTH - 48; // Account for padding (24px on each side)
  const indexRef = useRef(0);

  // One persistent opacity value per slide. Every slide stays mounted for the
  // whole lifetime of the component, so an <Image> source never changes while
  // it is visible. That removes the decode/reload blink entirely.
  const opacitiesRef = useRef<Animated.Value[]>([]);
  if (opacitiesRef.current.length !== images.length) {
    opacitiesRef.current = images.map((_, i) => new Animated.Value(i === 0 ? 1 : 0));
  }
  const opacities = opacitiesRef.current;

  // Preload every image up front so a crossfade never waits on the network.
  useEffect(() => {
    images.forEach((uri) => {
      if (uri) Image.prefetch(uri).catch(() => {});
    });
  }, [images]);

  // Reset to the first slide whenever the set of images changes.
  useEffect(() => {
    indexRef.current = 0;
    setCurrentIndex(0);
    opacitiesRef.current.forEach((value, i) => value.setValue(i === 0 ? 1 : 0));
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      const prev = indexRef.current;
      const next = (prev + 1) % images.length;
      indexRef.current = next;
      setCurrentIndex(next);

      // Crossfade: the outgoing slide fades out while the incoming slide fades
      // in on top. Both are already mounted and decoded, so nothing blinks.
      Animated.parallel([
        Animated.timing(opacities[prev], {
          toValue: 0,
          duration: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacities[next], {
          toValue: 1,
          duration: TRANSITION_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearInterval(interval);
  }, [images.length, delay, opacities]);

  if (images.length === 0) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <View style={styles.imageWrapper} pointerEvents="box-none">
        {images.map((uri, i) => (
          <Animated.View
            key={`${uri}-${i}`}
            style={[
              styles.imageContainer,
              {
                width: containerWidth,
                opacity: opacities[i],
                zIndex: i === currentIndex ? 1 : 0,
                transform: [
                  {
                    scale: opacities[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.08, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={{ uri }}
              style={styles.image}
              resizeMode="cover"
              fadeDuration={0}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            />
          </Animated.View>
        ))}
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
    aspectRatio: 4 / 5,
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
