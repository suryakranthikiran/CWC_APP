import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; // Replace with your Web3Forms access key

export default function PrayerScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [name, setName] = useState("");
  const [prayer, setPrayer] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !prayer.trim()) {
      alert("Please fill in both your name and prayer request.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Prayer Request from ${name.trim()}`,
          from_name: name.trim(),
          message: prayer.trim(),
          to: "tskranthikiran@gmail.com",
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Prayer request submitted successfully! We'll be praying for you 🙏");
        setName("");
        setPrayer("");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="arrow-back" size={22} color={theme.icon} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Prayer Requests</Text>
              <Text style={styles.headerSubtitle}>Share Your Heart</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        {/* Content */}
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* Info Section */}
            <Animated.View entering={FadeInUp.delay(100).duration(600)}>
              <View style={styles.infoBanner}>
                <Ionicons name="hand-right" size={28} color="#f472b6" />
                <Text style={styles.infoBannerText}>
                  Share your prayer requests and let our church family intercede
                  for you
                </Text>
              </View>
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInUp.delay(250).duration(700)}>
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Name</Text>

                  <View style={styles.inputWrapper}>
                    <Ionicons name="person" size={18} color="#a78bfa" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#64748b"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prayer Request</Text>

                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Share what you need prayers for..."
                    placeholderTextColor="#64748b"
                    multiline
                    value={prayer}
                    onChangeText={setPrayer}
                  />
                </View>
              </View>

              {/* Privacy Toggle */}
              {/* <View style={styles.privacyToggle}>
                <View style={styles.privacyContent}>
                  <Ionicons name="lock-closed" size={18} color="#818cf8" />
                  <Text style={styles.privacyLabel}>
                    Keep this private
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.toggleBox,
                    isPrivate && styles.toggleBoxActive,
                  ]}
                  onPress={() => setIsPrivate(!isPrivate)}
                >
                  {isPrivate && <View style={styles.toggleDot} />}
                </Pressable>
              </View> */}

              {/* Submit */}
              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && { opacity: 0.8 },
                  isSubmitting && { opacity: 0.6 },
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
                </Text>
                {!isSubmitting && (
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                )}
              </Pressable>
            </View>
            </Animated.View>

            {/* Guidelines */}
            <Animated.View entering={FadeInUp.delay(400).duration(700)}>
              <View style={styles.guidelinesSection}>
              <Text style={styles.guidelinesTitle}>Guidelines</Text>

              <View style={styles.guideline}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#34d399"
                />
                <Text style={styles.guidelineText}>
                  Be specific about your prayer request
                </Text>
              </View>

              <View style={styles.guideline}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#34d399"
                />
                <Text style={styles.guidelineText}>
                  Keep requests respectful and positive
                </Text>
              </View>

              <View style={styles.guideline}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#34d399"
                />
                <Text style={styles.guidelineText}>
                  Our prayer team meets weekly for intercession
                </Text>
              </View>
            </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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

  infoBanner: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },

  infoBannerText: {
    color: theme.textMuted,
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
  },

  formSection: {
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    color: theme.textMuted,
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 10,
  },

  input: {
    flex: 1,
    color: theme.textSecondary,
    fontSize: 15,
  },

  textAreaWrapper: {
    alignItems: "flex-start",
  },

  textArea: {
    flex: 1,
    color: theme.textSecondary,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 15,
  },

  privacyToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: theme.surface,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },

  privacyContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  privacyLabel: {
    color: theme.textSecondary,
    fontWeight: "600",
  },

  toggleBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#a78bfa",
    alignItems: "center",
    justifyContent: "center",
  },

  toggleBoxActive: {
    backgroundColor: "#a78bfa",
  },

  toggleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },

  submitButton: {
    backgroundColor: "rgba(167,139,250,0.2)",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.3)",
  },

  submitButtonText: {
    color: "#a78bfa",
    fontWeight: "800",
    fontSize: 15,
  },

  guidelinesSection: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  guidelinesTitle: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
    letterSpacing: -0.2,
  },

  guideline: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  guidelineText: {
    color: theme.textMuted,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});