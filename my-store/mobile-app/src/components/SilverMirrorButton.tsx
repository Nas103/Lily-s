import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

type SilverMirrorButtonProps = {
  text: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
};

export default function SilverMirrorButton({ text, onPress, style, textStyle }: SilverMirrorButtonProps) {
  const shineAnim1 = useRef(new Animated.Value(0)).current;
  const shineAnim2 = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

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
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 3000,
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
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Base silver gradient */}
      <LinearGradient
        colors={['#C0C0C0', '#E8E8E8', '#F5F5F5', '#E8E8E8', '#C0C0C0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.baseGradient}
      >
        {/* Reflective mirror layer */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mirrorLayer}
        >
          {/* First shine - left to right */}
          <Animated.View
            style={[
              styles.shine,
              {
                transform: [{ translateX: translateX1 }],
                opacity: shineAnim1,
              },
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.2, 0.5, 0.8, 1]}
              style={styles.shineGradient}
            />
          </Animated.View>

          {/* Second shine - right to left */}
          <Animated.View
            style={[
              styles.shine,
              {
                transform: [{ translateX: translateX2 }],
                opacity: shineAnim2,
              },
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.2, 0.5, 0.8, 1]}
              style={styles.shineGradient}
            />
          </Animated.View>

          {/* Continuous shimmer overlay */}
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerOpacity,
              },
            ]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>

          {/* Text */}
          <Text style={[styles.buttonText, textStyle]}>
            {text}
          </Text>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  baseGradient: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  mirrorLayer: {
    position: 'relative',
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100%',
  },
  shineGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 10,
  },
});

