import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMusicPlayer } from "../context/MusicPlayerContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = 100;

const NowPlayingScreen = () => {
  const {
    currentSong,
    isPlaying,
    nowPlayingVisible,
    positionMillis,
    durationMillis,
    isBuffering,
    error,
    togglePlayPause,
    playPreviousSong,
    playNextSong,
    seekToPosition,
    closeNowPlaying,
    openAddToPlaylist,
  } = useMusicPlayer();

  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Format time in mm:ss
  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progress =
    durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  // Handle progress bar press for seeking
  const handleProgressPress = (event) => {
    const { locationX } = event.nativeEvent;
    if (progressBarWidth > 0 && durationMillis > 0) {
      const position = (locationX / progressBarWidth) * durationMillis;
      seekToPosition(position);
    }
  };

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const isManuallyClosing = useRef(false);

  // Pan responder for swipe-down gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          // Close modal if swiped down enough
          handleClose();
        } else {
          // Snap back to original position
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Animate modal open/close
  useEffect(() => {
    if (nowPlayingVisible) {
      // Reset closing flag when opening
      isManuallyClosing.current = false;
      // Slide up
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!isManuallyClosing.current) {
      // Only animate if not manually closing (to avoid double animation)
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Reset pan position
      panY.setValue(0);
    } else {
      // If manually closing, just reset the values after modal is hidden
      // This ensures the modal is ready for next open
      translateY.setValue(SCREEN_HEIGHT);
      panY.setValue(0);
      isManuallyClosing.current = false;
    }
  }, [nowPlayingVisible]);

  const handleClose = () => {
    // Set flag to prevent useEffect from triggering conflicting animation
    isManuallyClosing.current = true;
    // Animate pan to screen height
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      closeNowPlaying();
    });
  };

  const handleAdd = () => {
    openAddToPlaylist(currentSong);
  };

  if (!currentSong) {
    return null;
  }

  return (
    <Modal
      visible={nowPlayingVisible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: Animated.add(translateY, panY) }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="chevron-down" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            <MaterialIcons name="playlist-add" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Album Artwork */}
        <View style={styles.artworkContainer}>
          <View style={styles.artwork}>
            <Text style={styles.artworkText}>Album Artwork</Text>
          </View>
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{currentSong.title}</Text>
          <Text style={styles.artistName}>{currentSong.artist}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <TouchableOpacity
            style={styles.progressBar}
            onPress={handleProgressPress}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setProgressBarWidth(width);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
              <View style={[styles.progressThumb, { left: `${progress}%` }]} />
            </View>
          </TouchableOpacity>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>
        </View>

        {/* Main Controls */}
        <View style={styles.mainControls}>
          <TouchableOpacity
            onPress={playPreviousSong}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-back" size={32} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={36}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNextSong} style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={32} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isBuffering && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Error Message */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  closeButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  addButton: {
    padding: 4,
    width: 40,
  },
  artworkContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  artwork: {
    width: 300,
    height: 300,
    backgroundColor: "#9CA3AF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  songInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  artistName: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    top: "50%",
    width: 14,
    height: 14,
    backgroundColor: "#000",
    borderRadius: 7,
    marginTop: -7,
    marginLeft: -7,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 13,
    color: "#666",
  },
  mainControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
    marginBottom: 48,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 56,
  },
  bottomButton: {
    padding: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  errorOverlay: {
    position: "absolute",
    bottom: 120,
    left: 24,
    right: 24,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NowPlayingScreen;
