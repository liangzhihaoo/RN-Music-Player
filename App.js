import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

// Import navigation
import LibraryNavigator from './navigation/LibraryNavigator';

// Import screens
import NowPlayingScreen from './screens/NowPlayingScreen';

// Import components
import MiniPlayer from './components/MiniPlayer';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

// Import context
import { MusicPlayerProvider } from './context/MusicPlayerContext';

// Data models (shared across app)
const SONGS = [
  { id: '1', title: 'SoundHelix Song 1', artist: 'SoundHelix', duration: '5:55', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'SoundHelix Song 2', artist: 'SoundHelix', duration: '5:37', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'SoundHelix Song 3', artist: 'SoundHelix', duration: '5:02', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'SoundHelix Song 4', artist: 'SoundHelix', duration: '5:23', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'SoundHelix Song 5', artist: 'SoundHelix', duration: '5:18', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: '6', title: 'SoundHelix Song 6', artist: 'SoundHelix', duration: '5:41', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: '7', title: 'SoundHelix Song 7', artist: 'SoundHelix', duration: '5:29', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: '8', title: 'SoundHelix Song 8', artist: 'SoundHelix', duration: '5:47', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: '9', title: 'SoundHelix Song 9', artist: 'SoundHelix', duration: '5:33', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: '10', title: 'SoundHelix Song 10', artist: 'SoundHelix', duration: '5:51', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: '11', title: 'SoundHelix Song 11', artist: 'SoundHelix', duration: '5:30', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: '12', title: 'SoundHelix Song 12', artist: 'SoundHelix', duration: '5:45', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: '13', title: 'SoundHelix Song 13', artist: 'SoundHelix', duration: '5:20', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
  { id: '14', title: 'SoundHelix Song 14', artist: 'SoundHelix', duration: '5:38', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
  { id: '15', title: 'SoundHelix Song 15', artist: 'SoundHelix', duration: '5:42', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
  { id: '16', title: 'SoundHelix Song 16', artist: 'SoundHelix', duration: '5:28', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
];

const PLAYLISTS = [
  { id: '1', name: 'Road Trip Mix', songIds: ['1', '3', '5', '7', '9', '11', '13', '15'] },
  { id: '2', name: 'Focus', songIds: ['2', '4', '6', '8', '10'] },
  { id: '3', name: 'All Songs', songIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'] },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MusicPlayerProvider songs={SONGS} initialPlaylists={PLAYLISTS}>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.appContainer}>
              <LibraryNavigator />
              <MiniPlayer />
            </View>
          </SafeAreaView>
          <NowPlayingScreen />
          <AddToPlaylistModal />
          <DeleteConfirmationModal />
        </NavigationContainer>
      </MusicPlayerProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  appContainer: {
    flex: 1,
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
});
