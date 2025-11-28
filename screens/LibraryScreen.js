import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SwipeableListProvider } from '../context/SwipeableListContext';

// Import components
import SongItem from '../components/SongItem';
import PlaylistItem from '../components/PlaylistItem';
import TabSwitcher from '../components/TabSwitcher';
import FloatingActionButton from '../components/FloatingActionButton';
import SwipeableListItem from '../components/SwipeableListItem';

const LibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('songs');
  const { songs, playlists, openCreatePlaylist, deletePlaylist, openDeleteConfirmation } = useMusicPlayer();

  const handlePlaylistPress = (playlist) => {
    navigation.navigate('PlaylistDetail', { playlist });
  };

  const handleDeletePlaylist = (playlist) => {
    openDeleteConfirmation('playlist', playlist, () => {
      deletePlaylist(playlist.id);
    });
  };

  const renderContent = () => {
    if (activeTab === 'songs') {
      return (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongItem song={item} />
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      return (
        <SwipeableListProvider>
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SwipeableListItem
                itemId={item.id}
                onDelete={() => handleDeletePlaylist(item)}
              >
                <PlaylistItem playlist={item} onPress={() => handlePlaylistPress(item)} />
              </SwipeableListItem>
            )}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </SwipeableListProvider>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with user icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity
          style={styles.userIconButton}
          onPress={() => navigation.navigate('UserInfo')}
        >
          <View style={styles.userIcon}>
            <Text style={styles.userIconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TabSwitcher activeTab={activeTab} onTabPress={setActiveTab} />
      {renderContent()}
      <FloatingActionButton
        visible={activeTab === 'playlists'}
        onPress={openCreatePlaylist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  userIconButton: {
    padding: 4,
  },
  userIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    fontSize: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default LibraryScreen;