import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
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

/* ---------- DATA ---------- */
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Life Changed",
    quote:
      "This church has completely transformed my life. The sermons are inspiring and the community is so welcoming.",
    avatar: "S",
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Found Purpose",
    quote:
      "I found my purpose and spiritual direction here. The leadership is amazing and truly cares about the congregation.",
    avatar: "M",
  },
  {
    id: 3,
    name: "Emma Williams",
    title: "Blessed Beyond Measure",
    quote:
      "The support from the church family during difficult times has been incredible. God's love is so evident here.",
    avatar: "E",
  },
  {
    id: 4,
    name: "James Brown",
    title: "Spiritual Growth",
    quote:
      "The Bible studies and prayer sessions have deepened my faith significantly. Highly recommend Christ Worship Center.",
    avatar: "J",
  },
];

/* ---------- COMPONENT ---------- */
export default function TestimonialsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const renderTestimony = ({ item, index }: { item: (typeof testimonials)[0]; index: number }) => (
    <Animated.View entering={FadeInUp.delay(200 + index * 120).duration(600)}>
      <View style={styles.testimonialCard}>
        <View style={styles.testimonialHeader}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatar}>{item.avatar}</Text>
          </View>

          <View style={styles.testimonialMeta}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons key={star} name="star" size={14} color="#fbbf24" />
            ))}
          </View>
        </View>

        <Text style={styles.quote}>{`"${item.quote}"`}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={theme.statusBar}
          translucent
          backgroundColor="transparent"
        />

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={theme.icon} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Testimonials</Text>
              <Text style={styles.headerSubtitle}>Faith Stories</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <FlatList
            data={testimonials}
            renderItem={renderTestimony}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const createStyles = (theme: AppTheme) => StyleSheet.create({
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
    paddingVertical: 16,
    paddingBottom: 40,
  },

  testimonialCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },

  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(167,139,250,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.2)",
  },

  avatar: {
    fontSize: 18,
    fontWeight: "900",
    color: "#a78bfa",
  },

  testimonialMeta: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.textSecondary,
    letterSpacing: -0.2,
  },

  title: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },

  starRating: {
    flexDirection: "row",
    gap: 2,
  },

  quote: {
    fontSize: 14,
    color: theme.textMuted,
    lineHeight: 22,
    fontStyle: "italic",
  },
});