import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    positionMillis,
    durationMillis,
    togglePlayPause,
    playPreviousSong,
    playNextSong,
    openNowPlaying,
  } = useMusicPlayer();

  // Calculate progress percentage
  const progress = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  if (!currentSong) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Player Content */}
      <TouchableOpacity
        style={styles.content}
        onPress={openNowPlaying}
        activeOpacity={0.7}
      >
        {/* Album Artwork */}
        <View style={styles.artwork}>
          <Ionicons name="musical-note" size={24} color="#666" />
        </View>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              playPreviousSong();
            }}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-back" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={styles.controlButton}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              playNextSong();
            }}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#f1f1f1',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  artwork: {
    width: 50,
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  artistName: {
    fontSize: 13,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    padding: 4,
  },
});

export default MiniPlayer;
