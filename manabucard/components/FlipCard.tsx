import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import type { ViewStyle } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 0.72;

const ACCENT = "#9100FF";

export interface FlipCardProps {
  frontText?: string | null;
  backText?: string | null;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  type?: "TEXT" | "IMAGE";
  isFlipped: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({
  frontText,
  backText,
  frontImageUrl,
  backImageUrl,
  type = "TEXT",
  isFlipped,
}) => {
  const flipValue = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(flipValue, {
      toValue: isFlipped ? 180 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flipValue]);

  const frontRotate = flipValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backRotate = flipValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleImageError = () => {
    setImageError("Failed to load image");
  };

  const showFrontImage = type === "IMAGE" && frontImageUrl && !imageError;
  const showBackImage = type === "IMAGE" && backImageUrl && !imageError;

  const renderFrontContent = () => {
    if (showFrontImage) {
      return (
        <Image
          source={{ uri: frontImageUrl! }}
          style={styles.image}
          resizeMode="contain"
          onError={handleImageError}
        />
      );
    }
    return (
      <Text style={styles.text} numberOfLines={10} adjustsFontSizeToFit>
        {frontText || "Ketuk untuk melihat jawaban"}
      </Text>
    );
  };

  const renderBackContent = () => {
    if (showBackImage) {
      return (
        <Image
          source={{ uri: backImageUrl! }}
          style={styles.image}
          resizeMode="contain"
          onError={handleImageError}
        />
      );
    }
    return (
      <Text style={styles.text} numberOfLines={10} adjustsFontSizeToFit>
        {backText || ""}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          styles.front,
          {
            transform: [{ rotateY: frontRotate }],
            backgroundColor: showFrontImage ? "#FFFFFF" : ACCENT,
          },
        ]}
      >
        <View style={styles.cardContent}>
          {type === "IMAGE" && frontImageUrl ? (
            <View style={styles.imageContainer}>
              {renderFrontContent()}
            </View>
          ) : (
            renderFrontContent()
          )}
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>
            {type === "IMAGE" ? "GAMBAR" : "PERTANYAAN"}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          styles.back,
          {
            transform: [{ rotateY: backRotate }],
            backgroundColor: showBackImage ? "#FFFFFF" : "#10B981",
          },
        ]}
      >
        <View style={styles.cardContent}>
          {type === "IMAGE" && backImageUrl ? (
            <View style={styles.imageContainer}>
              {renderBackContent()}
            </View>
          ) : (
            renderBackContent()
          )}
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>
            {type === "IMAGE" ? "GAMBAR" : "JAWABAN"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: CARD_HEIGHT,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 22,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden" as "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    overflow: "hidden" as "hidden",
  },
  front: {
    borderWidth: 2,
    borderColor: "rgba(145,0,255,0.3)",
  },
  back: {
    borderWidth: 2,
    borderColor: "rgba(16,185,129,0.3)",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 28,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  label: {
    position: "absolute" as "absolute",
    bottom: 12,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  labelText: {
    fontSize: 10,
    fontFamily: "Poppins_600SemiBold",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 1,
  },
});

export default FlipCard;

