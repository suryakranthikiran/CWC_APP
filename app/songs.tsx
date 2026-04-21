import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

const WORSHIP_CHANNEL_ID = "UCMgbYmq6I5zcQUiCN-k_pFA";
const WORSHIP_CHANNEL_URL = "https://www.youtube.com/@JohnWeslyMinistries/videos";
const SONG_INCLUDE_KEYWORDS = [
  " song",
  "song ",
  "song|",
  "songby",
  "worship",
  "praise",
  "lyrics",
  "cover song",
  "melody",
  "hyms",
  "hymn",
  "christian song",
];
const SONG_EXCLUDE_KEYWORDS = [
  "praying",
  "prayer",
  "promise",
  "sermon",
  "message",
  "bible study",
  "live",
  "service",
  "testimony",
  "healing prayer",
  "word of god",
  "devotional",
];

type Song = {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  publishedAt: string;
};

const decodeXmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const isSongVideoTitle = (title: string) => {
  const normalizedTitle = ` ${title.toLowerCase()} `;
  const matchesSongKeyword = SONG_INCLUDE_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword)
  );
  const matchesExcludedKeyword = SONG_EXCLUDE_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword)
  );

  return matchesSongKeyword && !matchesExcludedKeyword;
};

const formatSongDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recent upload";
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

async function fetchWorshipSongs(): Promise<Song[]> {
  const response = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${WORSHIP_CHANNEL_ID}`
  );

  if (!response.ok) {
    throw new Error("Unable to load worship songs right now.");
  }

  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  const uniqueSongs = new Map<string, Song>();

  entries.forEach((entry, index) => {
    const block = entry[1];
    const videoId = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    const rawTitle = block.match(/<title>(.*?)<\/title>/)?.[1];
    const publishedAt = block.match(/<published>(.*?)<\/published>/)?.[1] ?? "";
    const videoUrl = block.match(/<link rel="alternate" href="(.*?)"\/>/)?.[1];

    if (!videoId || !rawTitle || !videoUrl) {
      return;
    }

    const title = decodeXmlEntities(rawTitle);

    if (!isSongVideoTitle(title) || uniqueSongs.has(videoId)) {
      return;
    }

    const youtubeUrl = videoUrl.startsWith("http")
      ? videoUrl
      : `https://www.youtube.com/watch?v=${videoId}`;

    uniqueSongs.set(videoId, {
      id: `${videoId}-${index}`,
      title,
      artist: "John Wesly Ministries",
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      youtubeUrl,
      publishedAt,
    });
  });

  return [...uniqueSongs.values()];
}

/* ---------- COMPONENT ---------- */
export default function SongsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    let isMounted = true;

    const loadSongs = async () => {
      try {
        const channelSongs = await fetchWorshipSongs();

        if (isMounted) {
          setSongs(channelSongs);
          setLoadError(null);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load worship songs right now."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSongs();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const hasSearchQuery = searchQuery.trim().length > 0;

  const renderSong = ({ item, index }: { item: Song; index: number }) => (
    <Animated.View entering={FadeInUp.delay(200 + index * 100).duration(600)}>
      <Pressable
        style={({ pressed }) => [
          styles.songCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() => Linking.openURL(item.youtubeUrl)}
      >
        <View style={styles.albumArt}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnailImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{item.title}</Text>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>

        <View style={styles.rightContent}>
          <Text style={styles.duration}>{formatSongDate(item.publishedAt)}</Text>

          <View style={styles.playSmall}>
            <Ionicons name="open-outline" size={16} color="#fff" />
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
          <Animated.View entering={FadeInUp.delay(60).duration(600)}>
            <Pressable
              style={({ pressed }) => [
                styles.channelCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => Linking.openURL(WORSHIP_CHANNEL_URL)}
            >
              <View style={styles.channelCardIcon}>
                <Ionicons name="logo-youtube" size={22} color="#ef4444" />
              </View>

              <View style={styles.channelCardContent}>
                <Text style={styles.channelCardTitle}>John Wesly Ministries Songs</Text>
                <Text style={styles.channelCardText}>
                  This section shows song videos from the John Wesly Ministries YouTube channel feed.
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </Pressable>
          </Animated.View>

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

          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator color="#ef4444" />
              <Text style={styles.stateText}>Loading songs from YouTube channel...</Text>
            </View>
          ) : loadError ? (
            <View style={styles.stateCard}>
              <Ionicons name="alert-circle-outline" size={26} color="#ef4444" />
              <Text style={styles.stateText}>{loadError}</Text>
              <Pressable
                onPress={() => Linking.openURL(WORSHIP_CHANNEL_URL)}
                style={({ pressed }) => [
                  styles.channelButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.channelButtonText}>Open Channel on YouTube</Text>
              </Pressable>
            </View>
          ) : filteredSongs.length > 0 ? (
            <FlatList
              data={filteredSongs}
              renderItem={renderSong}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="musical-note" size={48} color="#a78bfa" />
              <Text style={styles.noResultsText}>
                {hasSearchQuery
                  ? "No matching songs found"
                  : "No song videos found in the latest channel uploads"}
              </Text>
              {!hasSearchQuery ? (
                <Pressable
                  onPress={() => Linking.openURL(WORSHIP_CHANNEL_URL)}
                  style={({ pressed }) => [
                    styles.channelButton,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={styles.channelButtonText}>Open Channel on YouTube</Text>
                </Pressable>
              ) : null}
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

  channelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },

  channelCardIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.18)",
  },

  channelCardContent: {
    flex: 1,
    paddingRight: 10,
  },

  channelCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 4,
  },

  channelCardText: {
    fontSize: 12,
    lineHeight: 18,
    color: theme.textMuted,
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
    overflow: "hidden",
    backgroundColor: theme.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
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

  stateCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },

  stateText: {
    marginTop: 12,
    textAlign: "center",
    color: theme.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },

  channelButton: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  channelButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
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