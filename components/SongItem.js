import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMusicPlayer } from "../context/MusicPlayerContext";

const SongItem = ({ song, songId, onPress }) => {
  const { setCurrentSong } = useMusicPlayer();

  // Get the songs array from context to resolve songId
  const context = useMusicPlayer();

  // Determine the actual song object
  let actualSong = song;
  if (!actualSong && songId && context.songs) {
    actualSong = context.songs.find((s) => s.id === songId);
  }

  if (!actualSong) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress(actualSong);
    } else {
      setCurrentSong(actualSong);
    }
  };

  return (
    <TouchableOpacity style={styles.songItem} onPress={handlePress}>
      <View style={styles.songThumbnail}>
        <Ionicons name="musical-note" size={20} color="#666" />
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{actualSong.title}</Text>
        <Text style={styles.songArtist}>{actualSong.artist}</Text>
      </View>
      <Text style={styles.songDuration}>{actualSong.duration}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingEnd: 10,
  },
  songThumbnail: {
    width: 40,
    height: 40,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 13,
    color: "#666",
  },
  songDuration: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
});

export default SongItem;
