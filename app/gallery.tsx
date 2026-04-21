import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

const galleryImages = [
  { id: 1, title: "Sunday Worship", category: "Services" },
  { id: 2, title: "Youth Outreach", category: "Events" },
  { id: 3, title: "Bible Study", category: "Activities" },
  { id: 4, title: "Community Service", category: "Outreach" },
  { id: 5, title: "Easter Celebration", category: "Events" },
  { id: 6, title: "Wedding Ceremony", category: "Services" },
];

export default function GalleryScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = (screenWidth - 48) / 2;
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={theme.gradient} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={theme.statusBar}
          translucent
          backgroundColor="transparent"
        />

        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="arrow-back" size={22} color={theme.icon} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Gallery</Text>
              <Text style={styles.headerSubtitle}>Church Moments & Events</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.gallery}>
            {galleryImages.map((image, index) => (
              <Animated.View
                key={image.id}
                entering={FadeInUp.delay(150 + index * 100).duration(600)}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.imageCard,
                    { width: imageWidth },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image" size={40} color="#a78bfa" />
                  </View>

                  <View style={styles.imageInfo}>
                    <Text style={styles.imageTitle}>{image.title}</Text>
                    <Text style={styles.imageCategory}>{image.category}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: theme.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    headerContent: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: theme.text,
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      fontSize: 11,
      color: theme.textMuted,
      fontWeight: "600",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginTop: 2,
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      paddingBottom: 40,
    },
    gallery: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    imageCard: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    cardPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.97 }],
    },
    imagePlaceholder: {
      width: "100%",
      height: 160,
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    imageInfo: {
      backgroundColor: theme.surface,
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    imageTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.textSecondary,
      letterSpacing: -0.2,
    },
    imageCategory: {
      fontSize: 11,
      color: theme.textMuted,
      fontWeight: "600",
      marginTop: 2,
    },
  });