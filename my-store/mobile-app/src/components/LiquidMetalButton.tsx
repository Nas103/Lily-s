import { View, Text, StyleSheet, Animated, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useEffect, useRef, ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

type LiquidMetalButtonProps = {
  theme?: 'gold' | 'silver' | 'bronze';
  textured?: boolean;
  children?: ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function LiquidMetalButton({ 
  theme = 'gold',
  textured = true,
  children,
  onPress,
  style,
  textStyle 
}: LiquidMetalButtonProps) {
  const shineAnim1 = useRef(new Animated.Value(0)).current;
  const shineAnim2 = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const themeColors = {
    gold: {
      gradient: ['#FCD34D', '#FBBF24', '#F59E0B', '#FBBF24', '#FCD34D'],
      border: 'rgba(251, 191, 36, 0.5)',
      shadow: '#F59E0B',
      text: '#78350F',
    },
    silver: {
      gradient: ['#C0C0C0', '#E8E8E8', '#F5F5F5', '#E8E8E8', '#C0C0C0'],
      border: 'rgba(255, 255, 255, 0.5)',
      shadow: '#C0C0C0',
      text: '#1F2937',
    },
    bronze: {
      gradient: ['#FB923C', '#F97316', '#EA580C', '#F97316', '#FB923C'],
      border: 'rgba(249, 115, 22, 0.5)',
      shadow: '#EA580C',
      text: '#7C2D12',
    },
  };

  const currentTheme = themeColors[theme];

  useEffect(() => {
    // First shine - moves left to right
    const animateShine1 = () => {
      Animated.sequence([
        Animated.timing(shineAnim1, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => animateShine1());
    };

    // Second shine - moves right to left (delayed)
    const animateShine2 = () => {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(shineAnim2, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(shineAnim2, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => animateShine2());
      }, 1500);
    };

    // Continuous shimmer effect
    const animateShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateShine1();
    animateShine2();
    animateShimmer();
  }, []);

  const translateX1 = shineAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const translateX2 = shineAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [200, -200],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.5, 0.2],
  });

  // Gold text shimmer animation
  const textShimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Text shimmer animation
    const animateTextShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(textShimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(textShimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateTextShimmer();
  }, [textShimmerAnim]);

  const textShimmerTranslateX = textShimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  const textShimmerOpacity = textShimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.9, 0.4],
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Black background with thin gold border */}
      <View style={[styles.baseContainer, { borderColor: '#FCD34D' }]}>
        {/* Content with gold shiny text */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            {/* Gold text with shimmer overlay */}
            <View style={styles.textWrapper}>
              {/* Text shimmer effect overlay */}
              <Animated.View
                style={[
                  styles.textShimmer,
                  {
                    transform: [{ translateX: textShimmerTranslateX }],
                    opacity: textShimmerOpacity,
                  },
                ]}
                pointerEvents="none"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.6)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.textShimmerGradient}
                />
              </Animated.View>
              {/* Actual text content - gold color */}
              <View style={styles.textContent}>
                {children}
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  baseContainer: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    overflow: 'hidden',
  },
  textWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  textShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40%',
    height: '100%',
    zIndex: 1,
  },
  textShimmerGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textContent: {
    position: 'relative',
    zIndex: 2,
  },
});

