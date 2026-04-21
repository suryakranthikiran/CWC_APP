import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = () => {
    if (isSignIn) {
      if (email && password) {
        router.push("/home");
      }
    } else {
      if (email && password && confirmPassword && fullName) {
        router.push("/home");
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={theme.statusBar} backgroundColor="transparent" translucent />

        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header with Back Button */}
            <Animated.View entering={FadeInDown.duration(600)}>
              <View style={styles.headerContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={22} color={theme.icon} />
                </Pressable>
              </View>
            </Animated.View>

            {/* Logo Section */}
            <Animated.View entering={FadeInUp.delay(100).duration(700)}>
              <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Ionicons name="cross" size={56} color={theme.text} />
              </View>
              <Text style={styles.brandName}>Christ Worship</Text>
              <Text style={styles.brandSubtitle}>Center</Text>
            </View>
            </Animated.View>

            {/* Toggle Tabs */}
            <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <View style={styles.tabsContainer}>
              <Pressable
                style={[
                  styles.tab,
                  isSignIn && styles.tabActive,
                ]}
                onPress={() => setIsSignIn(true)}
              >
                <Text
                  style={[
                    styles.tabText,
                    isSignIn && styles.tabTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.tab,
                  !isSignIn && styles.tabActive,
                ]}
                onPress={() => setIsSignIn(false)}
              >
                <Text
                  style={[
                    styles.tabText,
                    !isSignIn && styles.tabTextActive,
                  ]}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
            </Animated.View>

            {/* Form Section */}
            <Animated.View entering={FadeInUp.delay(300).duration(700)}>
            <View style={styles.formContainer}>
              {!isSignIn && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person" size={18} color="#fff" />
                      <TextInput
                        style={styles.input}
                        placeholder="John Doe"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={fullName}
                        onChangeText={setFullName}
                      />
                    </View>
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail" size={18} color="#fff" />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={18} color="#fff" />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#fff"
                    />
                  </Pressable>
                </View>
              </View>

              {!isSignIn && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed" size={18} color="#fff" />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <Pressable
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={18}
                        color="#fff"
                      />
                    </Pressable>
                  </View>
                </View>
              )}

              {isSignIn && (
                <Pressable style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </Pressable>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleAuth}
              >
                <Text style={styles.primaryButtonText}>
                  {isSignIn ? "Sign In" : "Create Account"}
                </Text>
              </Pressable>
            </View>
            </Animated.View>

            {/* Divider */}
            <Animated.View entering={FadeInUp.delay(400).duration(600)}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons name="logo-google" size={20} color="#e2e8f0" />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons name="logo-apple" size={20} color="#e2e8f0" />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons name="logo-facebook" size={20} color="#e2e8f0" />
              </Pressable>
            </View>
            </Animated.View>

            {/* Footer Text */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isSignIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Text
                  style={styles.footerLink}
                  onPress={() => setIsSignIn(!isSignIn)}
                >
                  {isSignIn ? "Sign Up" : "Sign In"}
                </Text>
              </Text>
            </View>

            {/* Church Info Footer */}
            <View style={styles.churchFooter}>
              <Text style={styles.churchFooterText}>
                Christ Worship Center - United in Faith, Love & Service
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(167,139,250,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(167,139,250,0.25)",
    marginBottom: 12,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.text,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "rgba(167,139,250,0.15)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.3)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.textMuted,
  },
  tabTextActive: {
    color: "#a78bfa",
  },
  formContainer: {
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.textMuted,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.border,
    height: 50,
    gap: 10,
  },
  input: {
    flex: 1,
    color: theme.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },
  forgotPassword: {
    marginTop: 4,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  primaryButton: {
    backgroundColor: "rgba(167,139,250,0.2)",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.3)",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#a78bfa",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    color: theme.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  footerLink: {
    color: "#a78bfa",
    fontWeight: "800",
  },
  churchFooter: {
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  churchFooterText: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: "center",
    fontStyle: "italic",
  },
});
