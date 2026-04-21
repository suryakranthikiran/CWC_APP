import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Clipboard,
    Dimensions,
    Image,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

const { width } = Dimensions.get("window");

/* ─── Animated Card Component ─── */
function FadeSlideIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

/* ─── Pulse Animation for QR ─── */
function PulseGlow({ children }: { children: React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {children}
    </Animated.View>
  );
}

/* ─── Copy Helper ─── */
const copyToClipboard = (text: string, label: string) => {
  if (Platform.OS === "web") {
    navigator.clipboard?.writeText(text);
  } else {
    Clipboard.setString(text);
  }
  alert(`${label} copied to clipboard!`);
};

/* ─── Info Row ─── */
function InfoRow({
  icon,
  label,
  value,
  theme,
  styles,
  copyable = false,
}: {
  icon: string;
  label: string;
  value: string;
  theme: AppTheme;
  styles: ReturnType<typeof createStyles>;
  copyable?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon as any} size={18} color="#a78bfa" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {copyable && (
        <Pressable
          onPress={() => copyToClipboard(value, label)}
          style={({ pressed }) => [
            styles.copyBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons name="copy-outline" size={18} color="#818cf8" />
        </Pressable>
      )}
    </View>
  );
}

export default function DonationScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar
          barStyle={theme.statusBar}
          translucent
          backgroundColor="transparent"
        />

        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>God&apos;s Work</Text>
            <Text style={styles.headerSubtitle}>Donation</Text>
          </View>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Hero Banner */}
          <FadeSlideIn delay={0}>
            <LinearGradient
              colors={["#7c3aed", "#6d28d9", "#4c1d95"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBanner}
            >
              <View style={styles.heroIconWrap}>
                <Ionicons name="heart" size={40} color="#f9a8d4" />
              </View>
              <Text style={styles.heroTitle}>Support God&apos;s Work</Text>
              <Text style={styles.heroSubtitle}>
                {`"Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."`}
              </Text>
              <Text style={styles.heroVerse}>— 2 Corinthians 9:7</Text>
            </LinearGradient>
          </FadeSlideIn>

          {/* ─── Bank Details Section ─── */}
          <FadeSlideIn delay={150}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={["#6366f1", "#818cf8"]}
                  style={styles.sectionIconBg}
                >
                  <Ionicons name="business" size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Bank Transfer</Text>
              </View>

              <View style={styles.divider} />

              <InfoRow
                icon="person"
                label="Account Holder"
                value="John Wesly Foundation"
                theme={theme}
                styles={styles}
                copyable
              />
              <InfoRow
                icon="card"
                label="Account Number"
                value="3512238243"
                theme={theme}
                styles={styles}
                copyable
              />
              <InfoRow
                icon="git-branch"
                label="IFSC Code"
                value="232323232"
                theme={theme}
                styles={styles}
                copyable
              />
            </View>
          </FadeSlideIn>

          {/* ─── UPI / PhonePe / GPay Section ─── */}
          <FadeSlideIn delay={300}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={["#ec4899", "#f472b6"]}
                  style={styles.sectionIconBg}
                >
                  <Ionicons name="phone-portrait" size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>UPI Payment</Text>
              </View>

              <View style={styles.divider} />

              {/* UPI Apps Row */}
              <View style={styles.upiAppsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.upiApp,
                    pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                  ]}
                  onPress={() => {
                    const url = "phonepe://pay?pa=1234@ybl&pn=John%20Wesly%20Foundation&cu=INR";
                    Linking.canOpenURL(url).then((supported) => {
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        alert("PhonePe app is not installed on this device.");
                      }
                    });
                  }}
                >
                  <View style={styles.upiAppIcon}>
                    <Image
                      source={{
                        uri: "https://e7.pngegg.com/pngimages/332/615/png-clipart-phonepe-india-unified-payments-interface-india-purple-violet.png",
                      }}
                      style={styles.upiLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.upiAppName}>PhonePe</Text>
                  <Text style={styles.upiTapHint}>Tap to pay</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.upiApp,
                    pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                  ]}
                  onPress={() => {
                    const url = "tez://upi/pay?pa=1234@ybl&pn=John%20Wesly%20Foundation&cu=INR";
                    Linking.canOpenURL(url).then((supported) => {
                      if (supported) {
                        Linking.openURL(url);
                      } else {
                        alert("Google Pay app is not installed on this device.");
                      }
                    });
                  }}
                >
                  <View style={styles.upiAppIcon}>
                    <Image
                      source={{
                        uri: "https://banner2.cleanpng.com/lnd/20241224/sz/a2c1516eae4cb9a792e8ef0f908ceb.webp",
                      }}
                      style={styles.upiLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.upiAppName}>Google Pay</Text>
                  <Text style={styles.upiTapHint}>Tap to pay</Text>
                </Pressable>
              </View>

              <InfoRow
                icon="call"
                label="Phone Number"
                value="123456789"
                theme={theme}
                styles={styles}
                copyable
              />
              <InfoRow
                icon="at"
                label="UPI ID"
                value="1234@ybl"
                theme={theme}
                styles={styles}
                copyable
              />
            </View>
          </FadeSlideIn>

          {/* ─── QR Code Section ─── */}
          <FadeSlideIn delay={450}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={["#10b981", "#34d399"]}
                  style={styles.sectionIconBg}
                >
                  <Ionicons name="qr-code" size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Scan & Pay</Text>
              </View>

              <View style={styles.divider} />

              <PulseGlow>
                <View style={styles.qrContainer}>
                  <LinearGradient
                    colors={["#1e1b4b", "#312e81"]}
                    style={styles.qrFrame}
                  >
                    {/* Corner decorations */}
                    <View style={[styles.qrCorner, styles.qrCornerTL]} />
                    <View style={[styles.qrCorner, styles.qrCornerTR]} />
                    <View style={[styles.qrCorner, styles.qrCornerBL]} />
                    <View style={[styles.qrCorner, styles.qrCornerBR]} />

                    {/* 
                      Replace the source below with your actual QR code image.
                      Place your QR image in assets/images/ (e.g., donation-qr.png)
                      Then use: require("../assets/images/donation-qr.png")
                    */}
                    <View style={styles.qrPlaceholder}>
                      <Ionicons name="qr-code" size={120} color="#818cf8" />
                      <Text style={styles.qrPlaceholderText}>
                        Place your QR code image in{"\n"}assets/images/donation-qr.png
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </PulseGlow>

              <Text style={styles.qrHint}>
                Open any UPI app and scan the QR code above
              </Text>
            </View>
          </FadeSlideIn>

          {/* ─── Note Section ─── */}
          <FadeSlideIn delay={600}>
            <View style={styles.noteCard}>
              <Ionicons name="shield-checkmark" size={24} color="#34d399" />
              <Text style={styles.noteText}>
                All donations are secure and used transparently for God&apos;s work.
                Thank you for your generous support! 🙏
              </Text>
            </View>
          </FadeSlideIn>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ─────────── STYLES ─────────── */
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
    borderRadius: 20,
    backgroundColor: theme.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* Hero */
  heroBanner: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  heroVerse: {
    fontSize: 13,
    color: "#c4b5fd",
    marginTop: 10,
    fontWeight: "600",
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: theme.textSecondary,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 16,
  },

  /* Info Row */
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(129, 140, 248, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: theme.textSecondary,
    fontWeight: "700",
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(129, 140, 248, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },

  /* UPI Apps */
  upiAppsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  upiApp: {
    alignItems: "center",
    gap: 6,
  },
  upiAppIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  upiLogo: {
    width: 48,
    height: 48,
  },
  upiAppName: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: "700",
  },
  upiTapHint: {
    fontSize: 10,
    color: "#818cf8",
    fontWeight: "500",
  },

  /* QR Code */
  qrContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  qrFrame: {
    width: 220,
    height: 220,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(129, 140, 248, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  qrPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrPlaceholderText: {
    fontSize: 11,
    color: theme.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  qrCorner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#818cf8",
  },
  qrCornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  qrCornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  qrCornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  qrCornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  qrHint: {
    textAlign: "center",
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 12,
  },

  /* Note */
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.2)",
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: theme.textMuted,
    lineHeight: 20,
  },
});
