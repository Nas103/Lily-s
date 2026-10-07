import { useEffect } from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface MoltenTitleProps {
  text?: string;
  style?: StyleProp<TextStyle>;
}

export default function MoltenTitle({ text = 'NaSO', style }: MoltenTitleProps) {
  const float = useSharedValue(0);
  const tilt = useSharedValue(-1);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    tilt.value = withRepeat(
      withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [float, tilt]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { translateY: float.value },
      { rotateX: `${-8 + tilt.value * 4}deg` },
      { rotateY: `${tilt.value * 12}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaskedView
        maskElement={<Text style={[styles.title, style]}>{text}</Text>}
      >
        <LinearGradient
          colors={['#4a2e0a', '#f5b301', '#fff7e6', '#f5b301', '#4a2e0a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={[styles.title, style, styles.hidden]}>{text}</Text>
        </LinearGradient>
      </MaskedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '300',
    letterSpacing: 2,
    color: '#000000',
  },
  gradient: {
    flexDirection: 'row',
  },
  hidden: {
    opacity: 0,
  },
});