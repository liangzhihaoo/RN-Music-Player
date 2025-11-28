import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import { useMusicPlayer } from '../context/MusicPlayerContext';

// Import components
import SongItem from '../components/SongItem';
import PlaylistItem from '../components/PlaylistItem';
import TabSwitcher from '../components/TabSwitcher';
import FloatingActionButton from '../components/FloatingActionButton';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

const LibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('songs');
  const { songs, playlists, openCreatePlaylist } = useMusicPlayer();

  const handlePlaylistPress = (playlist) => {
    navigation.navigate('PlaylistDetail', { playlist });
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
        <FlatList
          data={playlists}
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
      <FloatingActionButton
        visible={activeTab === 'playlists'}
        onPress={openCreatePlaylist}
      />
      <CreatePlaylistModal />
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