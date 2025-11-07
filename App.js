import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// Import navigation
import LibraryNavigator from './navigation/LibraryNavigator';

// Import screens
import NowPlayingScreen from './screens/NowPlayingScreen';

// Import components
import MiniPlayer from './components/MiniPlayer';

// Import context
import { MusicPlayerProvider } from './context/MusicPlayerContext';

// Data models (shared across app)
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

export default function App() {
  return (
    <MusicPlayerProvider songs={SONGS} playlists={PLAYLISTS}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.appContainer}>
            <LibraryNavigator />
            <MiniPlayer />
          </View>
        </SafeAreaView>
        <NowPlayingScreen />
      </NavigationContainer>
    </MusicPlayerProvider>
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
