import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

const { width } = Dimensions.get("window");

/* ─── Staggered Fade-In ─── */
function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* ─── Scale on Press ─── */
function ScalePress({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const s = createStyles(theme);

  const primaryFeatures = [
    {
      id: 1,
      title: "Sermons",
      subtitle: "Watch inspiring messages from our pastors",
      icon: "book",
      route: "/sermons" as Href,
      color: "#a78bfa",
    },
    {
      id: 2,
      title: "Worship Songs",
      subtitle: "Listen and sing along to praise music",
      icon: "musical-notes",
      route: "/songs" as Href,
      color: "#f472b6",
    },
  ];

  const menuItems = [
    {
      id: 3,
      title: "Gallery",
      subtitle: "Church moments & memories",
      icon: "images",
      route: "/gallery" as Href,
      color: "#38bdf8",
    },
    {
      id: 4,
      title: "Kid's Zone",
      subtitle: "Bible stories & quizzes",
      icon: "school",
      route: "/sunday-school" as Href,
      color: "#fbbf24",
    },
    {
      id: 5,
      title: "Prayer Requests",
      subtitle: "Submit & share prayers",
      icon: "heart",
      route: "/prayer" as Href,
      color: "#fb7185",
    },
    {
      id: 6,
      title: "Life Plans",
      subtitle: "Spiritual guidance & verses",
      icon: "compass",
      route: "/plans" as Href,
      color: "#2dd4bf",
    },
    {
      id: 7,
      title: "Testimonies",
      subtitle: "Read member stories",
      icon: "chatbubbles",
      route: "/testimonials" as Href,
      color: "#34d399",
    },
    {
      id: 8,
      title: "God's Work Donation",
      subtitle: "Support the ministry",
      icon: "gift",
      route: "/donation" as Href,
      color: "#fb923c",
    },
    {
      id: 9,
      title: "About Us",
      subtitle: "Learn our mission & vision",
      icon: "information-circle",
      route: "/about" as Href,
      color: "#c084fc",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={theme.statusBar} translucent />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* ─── Header ─── */}
          <FadeIn delay={0}>
            <View style={s.header}>
              <Pressable
                onPress={() => router.replace("/")}
                style={({ pressed }) => [
                  s.headerBtn,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Ionicons name="arrow-back" size={22} color={theme.icon} />
              </Pressable>

              <View style={s.headerCenter}>
                <Ionicons name="home" size={20} color="#a78bfa" />
                <Text style={s.headerTitle}>Christ Worship Center</Text>
              </View>

              <View style={{ width: 40 }} />
            </View>
          </FadeIn>

          {/* ─── Hero Section ─── */}
          <FadeIn delay={100}>
            <View style={s.heroSection}>
              <View style={s.crossWrap}>
                <Text style={s.crossIcon}>✝</Text>
              </View>
              <Text style={s.heroGreeting}>Welcome Home</Text>
              <Text style={s.heroVerse}>
                {`"For where two or three gather in my name,\nthere am I with them."`}
              </Text>
              <Text style={s.heroRef}>— Matthew 18:20</Text>
            </View>
          </FadeIn>

          {/* ─── Primary Feature Cards ─── */}
          <View style={s.primaryRow}>
            {primaryFeatures.map((item, i) => (
              <FadeIn key={item.id} delay={200 + i * 100} style={{ flex: 1 }}>
                <ScalePress
                  onPress={() => router.push(item.route)}
                  style={s.primaryCard}
                >
                  <View
                    style={[s.primaryIconWrap, { backgroundColor: item.color + "20" }]}
                  >
                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                  </View>
                  <Text style={s.primaryTitle}>{item.title}</Text>
                  <Text style={s.primarySub}>{item.subtitle}</Text>
                  <View style={s.primaryArrow}>
                    <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                  </View>
                </ScalePress>
              </FadeIn>
            ))}
          </View>

          {/* ─── Section Label ─── */}
          <FadeIn delay={400}>
            <View style={s.sectionLabelRow}>
              <View style={s.sectionLine} />
              <Text style={s.sectionLabel}>Explore</Text>
              <View style={s.sectionLine} />
            </View>
          </FadeIn>

          {/* ─── Menu List ─── */}
          <View style={s.menuList}>
            {menuItems.map((item, i) => (
              <FadeIn key={item.id} delay={450 + i * 60}>
                <ScalePress
                  onPress={() => router.push(item.route)}
                  style={s.menuItem}
                >
                  <View
                    style={[
                      s.menuIconWrap,
                      { backgroundColor: item.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>

                  <View style={s.menuText}>
                    <Text style={s.menuTitle}>{item.title}</Text>
                    <Text style={s.menuSub}>{item.subtitle}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </ScalePress>
              </FadeIn>
            ))}
          </View>

          {/* ─── Footer ─── */}
          <FadeIn delay={900}>
            <View style={s.footer}>
              <View style={s.footerDivider} />
              <Text style={s.footerText}>United in Faith, Love & Service</Text>
              <Text style={s.footerVerse}>
                Hebrews 10:25
              </Text>
            </View>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ─────────── STYLES ─────────── */
const createStyles = (theme: AppTheme) => StyleSheet.create({
  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.textSecondary,
    letterSpacing: 0.3,
  },

  /* Hero */
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 32,
  },
  crossWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  crossIcon: {
    fontSize: 26,
    color: "#a78bfa",
  },
  heroGreeting: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.text,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroVerse: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  heroRef: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 8,
    fontWeight: "600",
  },

  /* Primary Cards */
  primaryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 28,
  },
  primaryCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  primaryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  primaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.textSecondary,
    marginBottom: 4,
  },
  primarySub: {
    fontSize: 12,
    color: theme.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  primaryArrow: {
    alignSelf: "flex-end",
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Section Label */
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  /* Menu List */
  menuList: {
    paddingHorizontal: 16,
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 2,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.textSecondary,
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 12,
    color: theme.textMuted,
  },

  /* Footer */
  footer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 8,
    paddingHorizontal: 32,
  },
  footerDivider: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(167, 139, 250, 0.2)",
    borderRadius: 1,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  footerVerse: {
    fontSize: 11,
    color: theme.textMuted,
  },
});