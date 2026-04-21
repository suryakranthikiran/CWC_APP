import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useAppTheme();

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.safeArea}>
      <View pointerEvents="box-none" style={styles.wrapper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${theme.isDark ? "light" : "dark"} mode`}
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
              shadowColor: theme.shadow,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.toggleTrack }]}> 
            <Ionicons
              color={theme.toggleThumb}
              name={theme.isDark ? "sunny" : "moon"}
              size={16}
            />
          </View>
          <Text style={[styles.label, { color: theme.text }]}>{theme.isDark ? "Light" : "Dark"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 20,
  },
  wrapper: {
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
});