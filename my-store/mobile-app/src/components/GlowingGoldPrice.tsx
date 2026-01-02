import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

type GlowingGoldPriceProps = {
  price: string | number;
  style?: any;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '600' | '700';
};

export default function GlowingGoldPrice({ 
  price, 
  style, 
  fontSize = 16,
  fontWeight = '600' 
}: GlowingGoldPriceProps) {
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create continuous left-to-right and right-to-left animation
    const animate = () => {
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  const translateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const priceString = typeof price === 'number' ? price.toFixed(2) : price;

  return (
    <View style={[styles.container, style]}>
      {/* Use MaskedView to apply gradient only to text */}
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={styles.textContainer}>
            <Text style={[styles.priceText, { fontSize, fontWeight }]}>
              {priceString}
            </Text>
          </View>
        }
      >
        {/* Gold gradient background - only visible through text mask */}
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FFD700', '#FFA500', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          {/* Animated shine overlay - moves left to right and back */}
          <Animated.View
            style={[
              styles.shineOverlay,
              {
                transform: [{ translateX }],
              },
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.3, 0.5, 0.7, 1]}
              style={styles.shineGradient}
            />
          </Animated.View>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  maskedView: {
    flexDirection: 'row',
  },
  textContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gradientBackground: {
    flex: 1,
    minWidth: 60,
    minHeight: 20,
  },
  priceText: {
    backgroundColor: 'transparent',
    color: 'white', // This will be masked, so color doesn't matter - white areas show gradient
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100%',
    opacity: 1,
  },
  shineGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
