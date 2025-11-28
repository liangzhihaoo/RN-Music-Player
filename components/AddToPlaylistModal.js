import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMusicPlayer } from "../context/MusicPlayerContext";

const AddToPlaylistModal = () => {
  const {
    addToPlaylistVisible,
    addToPlaylistTargetSong,
    closeAddToPlaylist,
    playlists,
    addSongToMultiplePlaylists,
    openCreatePlaylist,
  } = useMusicPlayer();

  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize selected playlists when modal opens
  useEffect(() => {
    if (addToPlaylistVisible && addToPlaylistTargetSong) {
      // Pre-check playlists that already contain this song
      const preSelectedIds = new Set();
      playlists.forEach((playlist) => {
        if (playlist.songIds.includes(addToPlaylistTargetSong.id)) {
          preSelectedIds.add(playlist.id);
        }
      });
      setSelectedPlaylistIds(preSelectedIds);
      setIsSubmitting(false);
    }
  }, [addToPlaylistVisible, addToPlaylistTargetSong, playlists]);

  const handlePlaylistToggle = (playlistId) => {
    setSelectedPlaylistIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
      } else {
        newSet.add(playlistId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    if (selectedPlaylistIds.size === 0) {
      Alert.alert("Error", "Please select at least one playlist");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    const playlistIdsArray = Array.from(selectedPlaylistIds);
    addSongToMultiplePlaylists(addToPlaylistTargetSong.id, playlistIdsArray);
    closeAddToPlaylist();
  };

  const handleCancel = () => {
    closeAddToPlaylist();
  };

  const handleCreatePlaylist = () => {
    closeAddToPlaylist();
    openCreatePlaylist();
  };

  const renderPlaylistItem = ({ item }) => {
    const isSelected = selectedPlaylistIds.has(item.id);
    const songCount = item.songIds.length;

    return (
      <TouchableOpacity
        style={styles.playlistItem}
        onPress={() => handlePlaylistToggle(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isSelected ? "checkmark-circle" : "radio-button-off"}
          size={24}
          color={isSelected ? "#000" : "#999"}
          style={styles.checkbox}
        />
        <View style={styles.playlistInfo}>
          <Text style={styles.playlistName}>{item.name}</Text>
          <Text style={styles.songCount}>
            {songCount} {songCount === 1 ? "song" : "songs"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="musical-notes-outline" size={48} color="#999" />
      <Text style={styles.emptyText}>No playlists yet</Text>
      {/* <TouchableOpacity
        style={styles.createPlaylistButton}
        onPress={handleCreatePlaylist}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle-outline" size={20} color="#000" />
        <Text style={styles.createPlaylistText}>Create Playlist</Text>
      </TouchableOpacity> */}
    </View>
  );

  if (!addToPlaylistTargetSong) return null;

  return (
    <Modal
      visible={addToPlaylistVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Add to Playlist</Text>
          <Text style={styles.subtitle}>{addToPlaylistTargetSong.title}</Text>

          {playlists.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={renderPlaylistItem}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {playlists.length > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    maxHeight: 400,
    marginBottom: 20,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  checkbox: {
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  songCount: {
    fontSize: 13,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    marginBottom: 20,
  },
  createPlaylistButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  createPlaylistText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#000",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AddToPlaylistModal;
