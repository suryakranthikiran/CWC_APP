import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    ListRenderItem,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubeIframe from "react-native-youtube-iframe";

import type { AppTheme } from "../src/theme/colors";
import { useAppTheme } from "../src/theme/ThemeProvider";

/* ---------- TYPE ---------- */
type Sermon = {
  id: number;
  title: string;
  pastor: string;
  date: string;
  youtubeId: string;
  duration: string;
};

const sermons: Sermon[] = [
  {
    id: 1,
    title: "The Power of Faith",
    pastor: "John Wesly",
    date: "Apr 14, 2024",
    youtubeId: "3FRv09zMiDI",
    duration: "45 min",
  },
  {
    id: 2,
    title: "The Power of Faith",
    pastor: "John Wesly",
    date: "Apr 14, 2024",
    youtubeId: "3FRv09zMiDI",
    duration: "45 min",
  },
  {
    id: 3,
    title: "The Power of Faith",
    pastor: "John Wesly",
    date: "Apr 14, 2024",
    youtubeId: "3FRv09zMiDI",
    duration: "45 min",
  },
  
];

export default function SermonsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePress = (youtubeId: string) => {
    // tap same card toggles play/pause
    setPlayingId((prev) => (prev === youtubeId ? null : youtubeId));
  };

  const renderSermon: ListRenderItem<Sermon> = ({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(200 + index * 120).duration(600)}>
      <Pressable
        onPress={() => handlePress(item.youtubeId)}
        style={styles.sermonCardWrapper}
      >
        <View style={styles.sermonCard}>
          {/* VIDEO */}
          <View style={styles.videoContainer}>
            <YoutubeIframe
              height={200}
              play={playingId === item.youtubeId}
              videoId={item.youtubeId}
              onChangeState={(state: string) => {
                if (state === "ended") setPlayingId(null);
              }}
            />
          </View>

          {/* CONTENT */}
          <View style={styles.sermonContent}>
            <Text style={styles.sermonTitle}>{item.title}</Text>

            <Text style={styles.sermonPastor}>
              <Ionicons name="mic" size={12} color="#a78bfa" /> {item.pastor}
            </Text>

            <View style={styles.divider} />

            <View style={styles.sermonMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={12} color="#64748b" />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={12} color="#64748b" />
                <Text style={styles.metaText}>{item.duration}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent barStyle={theme.statusBar} backgroundColor="transparent" />

        {/* HEADER */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="arrow-back" size={22} color={theme.icon} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Sermons</Text>
              <Text style={styles.headerSubtitle}>Daily Inspiration</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        {/* LIST */}
        <FlatList
          data={sermons}
          renderItem={renderSermon}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const createStyles = (theme: AppTheme) => StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
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

  sermonCardWrapper: {
    marginBottom: 20,
  },

  sermonCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.border,
  },

  videoContainer: {
    backgroundColor: "#000",
  },

  sermonContent: {
    padding: 16,
  },

  sermonTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.textSecondary,
    letterSpacing: -0.2,
  },

  sermonPastor: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 12,
  },

  sermonMeta: {
    flexDirection: "row",
    gap: 20,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metaText: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: "600",
  },
});