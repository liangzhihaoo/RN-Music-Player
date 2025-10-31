import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SongItem = ({ song, onPress }) => (
  <TouchableOpacity style={styles.songItem} onPress={onPress}>
    <View style={styles.songThumbnail}>
      <Ionicons name="musical-note" size={20} color="#666" />
    </View>
    <View style={styles.songInfo}>
      <Text style={styles.songTitle}>{song.title}</Text>
      <Text style={styles.songArtist}>{song.artist}</Text>
    </View>
    <Text style={styles.songDuration}>{song.duration}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  songThumbnail: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 13,
    color: '#666',
  },
  songDuration: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
});

export default SongItem;