import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Linking,
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

/* ---------- DATA ---------- */
const songs = [
  {
    id: 1,
    title: "ప్రతి ఉదయమున",
    artist: "Blessy Wesly",
    youtubeId: "x1ODPpG1o2E",
    duration: "4:15",
  },
  {
    id: 2,
    title: "Blessy Wesly",
    artist: "Blessy Wesly",
    youtubeId: "DTGM4nafQQs",
    duration: "3:50",
  },
];

/* ---------- COMPONENT ---------- */
export default function SongsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSong = ({ item, index }: { item: (typeof songs)[0]; index: number }) => (
    <Animated.View entering={FadeInUp.delay(200 + index * 100).duration(600)}>
      <Pressable
        style={({ pressed }) => [
          styles.songCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() =>
          Linking.openURL(
            `https://www.youtube.com/watch?v=${item.youtubeId}`
          )
        }
      >
        <View style={styles.albumArt}>
          <Ionicons name="musical-note" size={24} color="#a78bfa" />
        </View>

        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.duration}>{item.duration}</Text>

          <View style={styles.playSmall}>
            <Ionicons name="play" size={16} color="#fff" />
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
              style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="arrow-back" size={22} color={theme.icon} />
            </Pressable>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Worship Songs</Text>
              <Text style={styles.headerSubtitle}>
                Praise & Thanksgiving
              </Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </Animated.View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Search */}
          <Animated.View entering={FadeInUp.delay(100).duration(600)}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#a78bfa" />

            <TextInput
              style={styles.searchInput}
              placeholder="Search songs or artist..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="#a78bfa"
                />
              </Pressable>
            ) : null}
          </View>
          </Animated.View>

          {filteredSongs.length > 0 ? (
            <FlatList
              data={filteredSongs}
              renderItem={renderSong}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="musical-note" size={48} color="#a78bfa" />
              <Text style={styles.noResultsText}>
                No songs found
              </Text>
            </View>
          )}
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

  songCard: {
    flexDirection: "row",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  albumArt: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(167,139,250,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },

  songInfo: {
    flex: 1,
  },

  songTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.textSecondary,
    letterSpacing: -0.2,
  },

  songArtist: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: "600",
    marginTop: 3,
  },

  rightContent: {
    alignItems: "flex-end",
  },

  duration: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: "600",
  },

  playSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(167,139,250,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.3)",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },

  searchInput: {
    flex: 1,
    color: theme.textSecondary,
    marginHorizontal: 10,
    fontSize: 14,
  },

  noResults: {
    alignItems: "center",
    paddingVertical: 40,
  },

  noResultsText: {
    marginTop: 12,
    color: theme.textMuted,
    fontSize: 16,
    fontWeight: "600",
  },
});