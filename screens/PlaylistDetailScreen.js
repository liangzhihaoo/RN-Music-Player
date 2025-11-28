import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SwipeableListProvider } from '../context/SwipeableListContext';
import SongItem from '../components/SongItem';
import SwipeableListItem from '../components/SwipeableListItem';

const PlaylistDetailScreen = ({ route, navigation }) => {
  const { playlist: routePlaylist } = route.params;
  const {
    playlists,
    songs,
    playPlaylist,
    shufflePlaylist,
    playSongFromPlaylist,
    removeSongFromPlaylist,
    openDeleteConfirmation,
  } = useMusicPlayer();

  // Get the live playlist from context by ID to ensure reactivity
  const playlist = playlists.find(p => p.id === routePlaylist.id) || routePlaylist;

  // Set custom header title with playlist name
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {playlist.name}
          </Text>
          <Text style={styles.songCount}>
            {playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      ),
    });
  }, [navigation, playlist]);

  const handlePlayPress = () => {
    playPlaylist(playlist);
  };

  const handleShufflePress = () => {
    shufflePlaylist(playlist);
  };

  const handleSongPress = (song) => {
    playSongFromPlaylist(song, playlist);
  };

  const handleDeleteSong = (songId) => {
    const song = songs.find(s => s.id === songId);
    if (song) {
      openDeleteConfirmation('song', song, () => {
        removeSongFromPlaylist(songId, playlist.id);
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={handlePlayPress}>
        <Ionicons name="play-circle" size={24} color="#000" />
        <Text style={styles.actionButtonText}>Play</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleShufflePress}>
        <Ionicons name="shuffle" size={24} color="#000" />
        <Text style={styles.actionButtonText}>Shuffle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeableListProvider>
        <FlatList
          data={playlist.songIds}
          keyExtractor={(songId) => songId}
          renderItem={({ item: songId }) => (
            <SwipeableListItem
              itemId={songId}
              onDelete={() => handleDeleteSong(songId)}
            >
              <SongItem songId={songId} onPress={handleSongPress} />
            </SwipeableListItem>
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
        />
      </SwipeableListProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  songCount: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default PlaylistDetailScreen;
