import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PlaylistItem = ({ playlist, onPress }) => (
  <TouchableOpacity style={styles.playlistItem} onPress={onPress}>
    <Ionicons
      name="chevron-forward"
      size={16}
      color="#666"
      style={styles.chevronIcon}
    />
    <View style={styles.playlistInfo}>
      <Text style={styles.playlistName}>{playlist.name}</Text>
      <Text style={styles.playlistSubtext}>
        {playlist.songIds.length} songs
      </Text>
    </View>
    <View style={styles.playlistRight} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingStart: 10,
  },
  chevronIcon: {
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  playlistSubtext: {
    fontSize: 13,
    color: "#666",
  },
  playlistRight: {
    width: 60,
  },
});

export default PlaylistItem;
