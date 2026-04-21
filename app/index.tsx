import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Animated as RNAnimated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

/* ─── Floating Orb ─── */
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay = 0,
}: {
  size: number;
  color: string;
  top: number;
  left: number;
  delay?: number;
}) {
  const translateY = useRef(new RNAnimated.Value(0)).current;
  const opacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      delay,
      useNativeDriver: true,
    }).start();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(translateY, {
          toValue: -12,
          duration: 3000 + delay,
          useNativeDriver: true,
        }),
        RNAnimated.timing(translateY, {
          toValue: 12,
          duration: 3000 + delay,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <RNAnimated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

/* ─── Pulsing Cross ─── */
function PulsingCross() {
  const { theme } = useAppTheme();
  const s = createStyles(theme);
  const scale = useRef(new RNAnimated.Value(1)).current;
  const glow = useRef(new RNAnimated.Value(0.3)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.parallel([
          RNAnimated.timing(scale, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
          RNAnimated.timing(glow, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
        ]),
        RNAnimated.parallel([
          RNAnimated.timing(scale, { toValue: 1, duration: 2000, useNativeDriver: true }),
          RNAnimated.timing(glow, { toValue: 0.3, duration: 2000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <RNAnimated.View style={{ transform: [{ scale }] }}>
      <View style={s.crossOuter}>
        <RNAnimated.View style={[s.crossGlow, { opacity: glow }]} />
        <View style={s.crossInner}>
          <Text style={s.crossSymbol}>✝</Text>
        </View>
      </View>
    </RNAnimated.View>
  );
}

const SCREEN_WIDTH = Dimensions.get("window").width;

/* ─── Auto-Scrolling Service & Activities Banner ─── */
function ServiceBanner() {
  const { theme } = useAppTheme();
  const s = createStyles(theme);
  const scrollRef = useRef<ScrollView>(null);

  const items = [
    // Sunday & Friday Services
    {
      type: "activity",
      day: "Sunday",
      time: "7:00 AM",
      title: "First Worship",
      desc: "Start your Sunday morning with praise and the Word of God",
      icon: "sunny",
      color: "#fbbf24",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "Sunday",
      time: "10:00 AM",
      title: "Second Worship",
      desc: "Join the congregation for powerful worship and sermon",
      icon: "people",
      color: "#a78bfa",
      image: "https://images.unsplash.com/photo-1636228492530-87c1f10f4b9e?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      type: "activity",
      day: "Sunday",
      time: "6:00 PM",
      title: "Evening Worship",
      desc: "End your day in God's presence with evening praise",
      icon: "moon",
      color: "#38bdf8",
      image: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "Friday",
      time: "10:00 AM",
      title: "Fasting Prayer",
      desc: "Powerful intercession and fasting with the church family",
      icon: "flame",
      color: "#fb923c",
      image: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=400&h=200&fit=crop",
    },
    // Activities & Meetings
    {
      type: "activity",
      day: "Saturday",
      time: "5:00 PM",
      title: "Youth Fellowship",
      desc: "Games, worship & Bible discussions for young people",
      icon: "people-circle",
      color: "#34d399",
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "Wednesday",
      time: "7:00 PM",
      title: "Bible Study",
      desc: "Deep dive into God's word with Pastor",
      icon: "book",
      color: "#818cf8",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "Sunday",
      time: "9:00 AM",
      title: "Sunday School",
      desc: "Bible stories, crafts & activities for children",
      icon: "school",
      color: "#fbbf24",
      image: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "Thursday",
      time: "6:30 PM",
      title: "Choir Practice",
      desc: "Rehearsal for Sunday worship team & choir members",
      icon: "mic",
      color: "#f472b6",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "1st Saturday",
      time: "10:00 AM",
      title: "Women's Meeting",
      desc: "Prayer, sharing & encouragement for women",
      icon: "heart-circle",
      color: "#fb7185",
      image: "https://images.unsplash.com/photo-1609234656388-0ff363383899?w=400&h=200&fit=crop",
    },
    {
      type: "activity",
      day: "2nd Saturday",
      time: "4:00 PM",
      title: "Community Outreach",
      desc: "Serving our neighbors with love and compassion",
      icon: "hand-left",
      color: "#2dd4bf",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop",
    },
  ];

  const loopedItems = [...items, ...items, ...items];
  const CARD_WIDTH = 220;
  const CARD_GAP = 12;
  const TOTAL_WIDTH = items.length * (CARD_WIDTH + CARD_GAP);

  useEffect(() => {
    let offset = 0;
    const interval = setInterval(() => {
      offset += 0.8;
      if (offset >= TOTAL_WIDTH) {
        offset = 0;
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      }
      scrollRef.current?.scrollTo({ x: offset, animated: false });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={s.bannerContainer}>
      <View style={s.bannerHeader}>
        <Ionicons name="calendar" size={16} color="#a78bfa" />
        <Text style={s.bannerTitle}>Services & Activities</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {loopedItems.map((item, i) => (
            <View key={i} style={s.activityCard}>
              <Image
                source={{ uri: item.image }}
                style={s.activityImage}
              />
              <LinearGradient
                colors={["transparent", theme.isDark ? "rgba(10,10,26,0.95)" : "rgba(248,250,252,0.96)"]}
                style={s.activityOverlay}
              />
              <View style={s.activityContent}>
                <View style={s.activityTopRow}>
                  <View style={[s.activityDayBadge, { backgroundColor: item.color + "30" }]}>
                    <Ionicons name={item.icon as any} size={12} color={item.color} />
                    <Text style={[s.activityDayText, { color: item.color }]}>{item.day}</Text>
                  </View>
                </View>
                <Text style={s.activityTitle}>{item.title}</Text>
                <Text style={s.activityDesc} numberOfLines={2}>{item.desc}</Text>
                <View style={s.activityTimeRow}>
                  <Ionicons name="time-outline" size={12} color={theme.textMuted} />
                  <Text style={s.activityTime}>{item.time}</Text>
                </View>
              </View>
            </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function Index() {
  const { theme } = useAppTheme();
  const s = createStyles(theme);
  const [shouldEnter, setShouldEnter] = useState(false);

  if (shouldEnter) {
    return <Redirect href="/home" />;
  }

  const jesusQuotes = [
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
    { text: "For God so loved the world that he gave his one and only Son.", ref: "John 3:16" },
    { text: "I am the light of the world. Whoever follows me will never walk in darkness.", ref: "John 8:12" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  ];

  const quote = jesusQuotes[Math.floor(Math.random() * jesusQuotes.length)];

  const features = [
    { icon: "book", label: "Sermons", color: "#a78bfa" },
    { icon: "musical-notes", label: "Worship", color: "#f472b6" },
    { icon: "people", label: "Community", color: "#38bdf8" },
    { icon: "heart", label: "Prayer", color: "#fb7185" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating orbs */}
      <FloatingOrb size={180} color="rgba(167,139,250,0.06)" top={-40} left={-60} delay={0} />
      <FloatingOrb size={140} color="rgba(244,114,182,0.05)" top={200} left={250} delay={400} />
      <FloatingOrb size={160} color="rgba(56,189,248,0.04)" top={500} left={-40} delay={800} />
      <FloatingOrb size={100} color="rgba(251,113,133,0.05)" top={650} left={220} delay={600} />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={theme.statusBar} translucent backgroundColor="transparent" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* ─── Logo & Church Name ─── */}
          <Animated.View entering={FadeInDown.duration(800)} style={s.logoSection}>
            <View style={s.logoRing}>
              <Image
                source={require("../assets/images/WeslyAnna.avif")}
                style={s.logoImage}
              />
            </View>

            <Text style={s.churchName}>Christ Worship Center</Text>

            <View style={s.taglineRow}>
              <View style={s.taglineLine} />
              <Text style={s.tagline}>United in Faith, Love & Service</Text>
              <View style={s.taglineLine} />
            </View>
          </Animated.View>

          {/* ─── Pulsing Cross ─── */}
          <Animated.View entering={FadeInUp.delay(200).duration(700)} style={s.crossSection}>
            <PulsingCross />
          </Animated.View>

          {/* ─── Scripture Quote ─── */}
          <Animated.View entering={FadeInUp.delay(350).duration(800)}>
            <View style={s.quoteCard}>
              <View style={s.quoteAccent} />
              <View style={s.quoteContent}>
                <Text style={s.quoteIcon}>{`"`}</Text>
                <Text style={s.quoteText}>{quote.text}</Text>
                <View style={s.quoteDivider} />
                <View style={s.quoteRefRow}>
                  <Ionicons name="bookmark" size={14} color="#a78bfa" />
                  <Text style={s.quoteRef}>{quote.ref}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ─── Service Schedule Banner ─── */}
          <Animated.View entering={FadeInUp.delay(420).duration(700)}>
            <ServiceBanner />
          </Animated.View>

          {/* ─── Welcome Message ─── */}
          <Animated.View entering={FadeInUp.delay(580).duration(700)}>
            <View style={s.welcomeCard}>
              <View style={s.welcomeHeader}>
                <View style={s.welcomeIconWrap}>
                  <Ionicons name="sparkles" size={18} color="#fbbf24" />
                </View>
                <Text style={s.welcomeTitle}>Welcome </Text>
              </View>
              <Text style={s.welcomeText}>
                Join our faith community and experience God&apos;s love through worship,
                fellowship, and spiritual growth. Together we grow stronger in Christ.
              </Text>
            </View>
          </Animated.View>

          {/* ─── Features ─── */}
          <Animated.View entering={FadeInUp.delay(650).duration(800)}>
            <View style={s.featuresRow}>
              {features.map((f, i) => (
                <View key={i} style={s.featureItem}>
                  <View style={[s.featureIconWrap, { backgroundColor: f.color + "15" }]}>
                    <Ionicons name={f.icon as any} size={24} color={f.color} />
                  </View>
                  <Text style={s.featureLabel}>{f.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ─── Get Started Button ─── */}
          <Animated.View entering={FadeInUp.delay(800).duration(700)} style={s.buttonSection}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enter the church"
              onPressIn={() => setShouldEnter(true)}
              onPress={() => setShouldEnter(true)}
              style={({ pressed }) => [
                s.buttonWrap,
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
            >
              <LinearGradient
                colors={["#7c3aed", "#6d28d9", "#5b21b6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.button}
              >
                <Text style={s.buttonText}>Enter the Church</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </Pressable>

            <Text style={s.footerHint}>
              Sermons · Songs · Prayers · Community
            </Text>
          </Animated.View>

          {/* ─── Footer ─── */}
          <Animated.View entering={FadeInUp.delay(950).duration(600)} style={s.footer}>
            <View style={s.footerLine} />
            <Ionicons name="heart" size={12} color={theme.textMuted} />
            <Text style={s.footerVerse}>
              {`"Let us not give up meeting together"`} - Hebrews 10:25
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ─────────── STYLES ─────────── */
const createStyles = (theme: AppTheme) => StyleSheet.create({
  /* Logo */
  logoSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 8,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "rgba(167,139,250,0.3)",
    padding: 4,
    marginBottom: 18,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  churchName: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.text,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taglineLine: {
    width: 24,
    height: 1,
    backgroundColor: "rgba(167,139,250,0.3)",
  },
  tagline: {
    fontSize: 12,
    color: theme.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },

  /* Cross */
  crossSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  crossOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  crossGlow: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#a78bfa",
  },
  crossInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.surfaceElevated,
    borderWidth: 1.5,
    borderColor: "rgba(167,139,250,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  crossSymbol: {
    fontSize: 28,
    color: "#a78bfa",
  },

  /* Quote */
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: "hidden",
    flexDirection: "row",
  },
  quoteAccent: {
    width: 4,
    backgroundColor: "#a78bfa",
  },
  quoteContent: {
    flex: 1,
    padding: 24,
  },
  quoteIcon: {
    fontSize: 40,
    color: "rgba(167,139,250,0.3)",
    fontFamily: "serif",
    lineHeight: 36,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 18,
    color: theme.textSecondary,
    fontStyle: "italic",
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  quoteDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 16,
  },
  quoteRefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quoteRef: {
    fontSize: 13,
    color: theme.textMuted,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  /* Welcome */
  welcomeCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 22,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  welcomeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(251,191,36,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.textSecondary,
    letterSpacing: 0.2,
  },
  welcomeText: {
    fontSize: 14,
    color: theme.textMuted,
    lineHeight: 22,
  },

  /* Features */
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  featureItem: {
    alignItems: "center",
    gap: 8,
  },
  featureIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  featureLabel: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  /* Button */
  buttonSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    zIndex: 2,
  },
  buttonWrap: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
    borderRadius: 18,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
  footerHint: {
    textAlign: "center",
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 12,
    letterSpacing: 0.5,
  },

  /* Footer */
  footer: {
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  footerLine: {
    width: 32,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(167,139,250,0.15)",
  },
  footerVerse: {
    fontSize: 11,
    color: theme.textMuted,
    fontStyle: "italic",
  },

  /* Service Banner */
  bannerContainer: {
    marginBottom: 20,
    paddingTop: 4,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  /* Activity Cards */
  activityCard: {
    width: 220,
    height: 200,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  activityImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    position: "absolute",
  },
  activityOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    borderRadius: 16,
  },
  activityContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  activityTopRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  activityDayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activityDayText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 3,
  },
  activityDesc: {
    fontSize: 11,
    color: theme.textMuted,
    lineHeight: 15,
    marginBottom: 6,
  },
  activityTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activityTime: {
    fontSize: 11,
    color: theme.textMuted,
    fontWeight: "600",
  },
});