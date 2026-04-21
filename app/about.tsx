import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Linking,
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

export default function AboutScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const socialLinks = [
    {
      id: "facebook",
      icon: "logo-facebook",
      url: "https://facebook.com",
      backgroundColor: "#1877F2",
      borderColor: "#1664D9",
      iconColor: "#FFFFFF",
    },
    {
      id: "instagram",
      icon: "logo-instagram",
      url: "https://instagram.com",
      backgroundColor: "#F77737",
      borderColor: "#E05D21",
      iconColor: "#FFFFFF",
    },
    {
      id: "youtube",
      icon: "logo-youtube",
      url: "https://www.youtube.com/@JohnWeslyMinistries",
      backgroundColor: "#FF0000",
      borderColor: "#D90429",
      iconColor: "#FFFFFF",
    },
  ] as const;

  const values = [
    {
      icon: "heart",
      title: "Love",
      description: "Love God and love one another",
    },
    {
      icon: "shield-checkmark",
      title: "Integrity",
      description: "Living with honesty and strong moral principles",
    },
    {
      icon: "people",
      title: "Community",
      description: "Building a strong, united church family",
    },
    {
      icon: "book",
      title: "Faith",
      description: "Grounded in the word of God",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={theme.statusBar} translucent backgroundColor="transparent" />

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}>
              <Ionicons name="arrow-back" size={22} color={theme.icon} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>About Us</Text>
              <Text style={styles.headerSubtitle}>Our Story & Values</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          
          {/* Mission */}
          <Animated.View entering={FadeInUp.delay(100).duration(600)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Mission</Text>
              <View style={styles.card}>
              <Text style={styles.cardText}>
                Christ Worship Center is dedicated to spreading the gospel of
                Jesus Christ, providing spiritual guidance, and building a
                community of believers united in faith, love, and service.
              </Text>
            </View>
          </View>
          </Animated.View>

          {/* Vision */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Vision</Text>
              <View style={styles.card}>
              <Text style={styles.cardText}>
                To be a beacon of hope and light in our community, transforming
                lives through Christ&apos;s love and empowering people to live
                purposeful lives.
              </Text>
            </View>
          </View>
          </Animated.View>

          {/* Core Values */}
          <Animated.View entering={FadeInUp.delay(300).duration(700)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Core Values</Text>

              {values.map((value, index) => (
                <View key={index} style={styles.valueCard}>
                  <View style={styles.valueIconBox}>
                    <Ionicons name={value.icon as any} size={24} color="#a78bfa" />
                  </View>

                  <View style={styles.valueContent}>
                    <Text style={styles.valueTitle}>{value.title}</Text>
                    <Text style={styles.valueDescription}>{value.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* History */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)}>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our History</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                Founded in 2010, Christ Worship Center has grown into a thriving
                community. Our journey continues with faith and dedication.
              </Text>
            </View>
          </View>
          </Animated.View>

          {/* Address */}
          <Animated.View entering={FadeInUp.delay(500).duration(600)}>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Location</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                Christ Worship Center{"\n"}
                Hyderabad, Telangana, India
              </Text>

              <Pressable
                style={styles.mapButton}
                onPress={() =>
                  Linking.openURL("https://maps.google.com/?q=Hyderabad")
                }
              >
                <Ionicons name="location" size={18} color="#fff" />
                <Text style={styles.mapText}>Open in Maps</Text>
              </Pressable>
            </View>
          </View>
          </Animated.View>

          {/* Social Media */}
          <Animated.View entering={FadeInUp.delay(600).duration(600)}>
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connect With Us</Text>

            <View style={styles.socialContainer}>
              {socialLinks.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.socialButton,
                    {
                      backgroundColor: item.backgroundColor,
                      borderColor: item.borderColor,
                    },
                    pressed && styles.socialButtonPressed,
                  ]}
                  onPress={() => Linking.openURL(item.url)}
                >
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </Pressable>
              ))}

{/* 
              <Pressable
                style={styles.socialButton}
                onPress={() => Linking.openURL("https://wa.me/919999999999")}
              >
                <Ionicons name="logo-whatsapp" size={22} color="#fff" />
              </Pressable> */}
            </View>
          </View>
          </Animated.View>

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
    padding: 16,
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
    padding: 16,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.textSecondary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  card: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },

  cardText: {
    fontSize: 14,
    color: theme.textMuted,
    lineHeight: 22,
  },

  valueCard: {
    flexDirection: "row",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },

  valueIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(167,139,250,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },

  valueContent: {
    flex: 1,
  },

  valueTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.textSecondary,
    letterSpacing: -0.2,
  },

  valueDescription: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 3,
    lineHeight: 19,
  },

  mapButton: {
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "rgba(167,139,250,0.15)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)",
  },

  mapText: {
    color: "#a78bfa",
    marginLeft: 6,
    fontWeight: "700",
    fontSize: 13,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 14,
  },

  socialButton: {
    width: 58,
    height: 58,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  socialButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});