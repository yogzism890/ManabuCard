import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface FlipCardProps {
  frontText: string;
  backText: string;
  isFlipped: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontText, backText, isFlipped }) => {
  const flipAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 180 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          styles.front,
          { transform: [{ rotateY: frontInterpolate }] },
        ]}
      >
        <Text style={styles.text}>{frontText}</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.back,
          { transform: [{ rotateY: backInterpolate }] },
        ]}
      >
        <Text style={styles.text}>{backText}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    padding: 20,
  },
  front: {
    backgroundColor: '#3498db',
  },
  back: {
    backgroundColor: '#2ecc71',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default FlipCard;
