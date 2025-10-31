import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';

// Import components
import SongItem from '../components/SongItem';
import PlaylistItem from '../components/PlaylistItem';
import TabSwitcher from '../components/TabSwitcher';

// Data models
const SONGS = [
  { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55' },
  { id: '2', title: 'Hotel California', artist: 'Eagles', duration: '6:30' },
  { id: '3', title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: '8:02' },
  { id: '4', title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', duration: '5:03' },
];

const PLAYLISTS = [
  { id: '1', name: 'Road Trip Mix', songIds: ['1', '2', '4'] },
  { id: '2', name: 'Focus', songIds: ['3'] },
  { id: '3', name: 'Classics', songIds: ['1', '2', '3', '4'] },
];

const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState('songs');

  const handleSongPress = (song) => {
    console.log('Play song:', song.title);
  };

  const handlePlaylistPress = (playlist) => {
    console.log('Open playlist:', playlist.name);
  };

  const renderContent = () => {
    if (activeTab === 'songs') {
      return (
        <FlatList
          data={SONGS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongItem song={item} onPress={() => handleSongPress(item)} />
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      return (
        <FlatList
          data={PLAYLISTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaylistItem playlist={item} onPress={() => handlePlaylistPress(item)} />
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <TabSwitcher activeTab={activeTab} onTabPress={setActiveTab} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default LibraryScreen;