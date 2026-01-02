import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import { useEffect, useRef, useState } from 'react';
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
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  useEffect(() => {
    // Create continuous shimmer animation
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
    outputRange: [-textWidth, textWidth],
  });

  const onTextLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTextWidth(width);
    setTextHeight(height);
  };

  const priceString = typeof price === 'number' ? price.toFixed(2) : price;

  return (
    <View style={[styles.container, style]}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Text 
            style={[styles.maskText, { fontSize, fontWeight }]}
            onLayout={onTextLayout}
          >
            {priceString}
          </Text>
        }
      >
        {/* Gold gradient - only visible through text mask */}
        <View style={[styles.gradientContainer, { width: textWidth || 100, height: textHeight || 24 }]}>
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {/* Shimmer overlay */}
            {textWidth > 0 && (
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{ translateX }],
                    width: textWidth * 0.5,
                  },
                ]}
                pointerEvents="none"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmerGradient}
                />
              </Animated.View>
            )}
          </LinearGradient>
        </View>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  maskedView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  maskText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF', // White for mask - gold will show through
  },
  gradientContainer: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    height: '100%',
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
