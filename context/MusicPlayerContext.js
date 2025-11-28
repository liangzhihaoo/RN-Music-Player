import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

const PLAYLISTS_STORAGE_KEY = '@MusicPlayer_Playlists';

export const MusicPlayerProvider = ({ children, songs = [], initialPlaylists = [] }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingVisible, setNowPlayingVisible] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistDetailVisible, setPlaylistDetailVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [createPlaylistVisible, setCreatePlaylistVisible] = useState(false);
  const [addToPlaylistVisible, setAddToPlaylistVisible] = useState(false);
  const [addToPlaylistTargetSong, setAddToPlaylistTargetSong] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState(null);

  // Audio playback state
  const soundRef = useRef(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load playlists from AsyncStorage on mount
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const storedPlaylists = await AsyncStorage.getItem(PLAYLISTS_STORAGE_KEY);
        if (storedPlaylists) {
          setPlaylists(JSON.parse(storedPlaylists));
        } else {
          setPlaylists(initialPlaylists);
        }
      } catch (error) {
        console.error('Failed to load playlists:', error);
        setPlaylists(initialPlaylists);
      }
    };

    loadPlaylists();
  }, []);

  // Save playlists to AsyncStorage whenever they change
  useEffect(() => {
    const savePlaylists = async () => {
      try {
        await AsyncStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
      } catch (error) {
        console.error('Failed to save playlists:', error);
      }
    };

    if (playlists.length > 0) {
      savePlaylists();
    }
  }, [playlists]);

  // Initialize audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Failed to set audio mode:', error);
        setError('Failed to initialize audio');
      }
    };

    setupAudio();

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Playback status callback
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPositionMillis(status.positionMillis || 0);
      setDurationMillis(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);

      // Auto-advance when song finishes
      if (status.didJustFinish && !status.isLooping) {
        playNextSong();
      }
    } else if (status.error) {
      console.error('Playback error:', status.error);
      setError('Playback error occurred');
    }
  };

  // Load audio function
  const loadAudio = async (song) => {
    try {
      // Unload previous sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsLoaded(false);
      }

      setError(null);
      setIsBuffering(true);
      setPositionMillis(0);
      setDurationMillis(0);

      // Create new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setIsBuffering(false);
      setIsLoaded(true);

      return newSound;
    } catch (err) {
      console.error('Error loading audio:', err);
      setError(`Failed to load: ${song.title}`);
      setIsBuffering(false);
      return null;
    }
  };

  const togglePlayPause = async () => {
    try {
      if (!soundRef.current || !isLoaded) return;

      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (err) {
      console.error('Error toggling playback:', err);
    }
  };

  const openNowPlaying = () => {
    setNowPlayingVisible(true);
    console.log('Opening Now Playing screen');
  };

  const closeNowPlaying = () => {
    setNowPlayingVisible(false);
    console.log('Closing Now Playing screen');
  };

  const openPlaylistDetail = (playlist) => {
    setSelectedPlaylist(playlist);
    setPlaylistDetailVisible(true);
    console.log('Opening Playlist Detail:', playlist.name);
  };

  const closePlaylistDetail = () => {
    setPlaylistDetailVisible(false);
    setSelectedPlaylist(null);
    console.log('Closing Playlist Detail');
  };

  const playPreviousSong = async () => {
    if (!currentSong) return;

    let previousSong = null;

    // If playing from a playlist, navigate within playlist
    if (currentPlaylist) {
      const playlistSongs = currentPlaylist.songIds
        .map(id => songs.find(song => song.id === id))
        .filter(Boolean);

      if (playlistSongs.length === 0) return;

      const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : playlistSongs.length - 1;
      previousSong = playlistSongs[previousIndex];
    } else {
      // Global navigation
      if (songs.length === 0) return;
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
      previousSong = songs[previousIndex];
    }

    if (previousSong) {
      await playSong(previousSong);
    }
  };

  const playNextSong = async () => {
    if (!currentSong) return;

    let nextSong = null;

    // If playing from a playlist, navigate within playlist
    if (currentPlaylist) {
      const playlistSongs = currentPlaylist.songIds
        .map(id => songs.find(song => song.id === id))
        .filter(Boolean);

      if (playlistSongs.length === 0) return;

      const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % playlistSongs.length;
      nextSong = playlistSongs[nextIndex];
    } else {
      // Global navigation
      if (songs.length === 0) return;
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      nextSong = songs[nextIndex];
    }

    if (nextSong) {
      await playSong(nextSong);
    }
  };

  const playSong = async (song) => {
    try {
      setCurrentSong(song);
      setError(null);

      const loadedSound = await loadAudio(song);

      if (loadedSound) {
        await loadedSound.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error playing song:', err);
      setError('Failed to play song');
    }
  };

  const playSongFromPlaylist = async (song, playlist) => {
    setCurrentPlaylist(playlist);
    await playSong(song);
  };

  const playPlaylist = async (playlist) => {
    const playlistSongs = playlist.songIds
      .map(id => songs.find(song => song.id === id))
      .filter(Boolean);

    if (playlistSongs.length === 0) return;

    setCurrentPlaylist(playlist);
    await playSong(playlistSongs[0]);
  };

  const shufflePlaylist = async (playlist) => {
    const playlistSongs = playlist.songIds
      .map(id => songs.find(song => song.id === id))
      .filter(Boolean);

    if (playlistSongs.length === 0) return;

    // Shuffle array
    const shuffled = [...playlistSongs].sort(() => Math.random() - 0.5);

    // Create a temporary shuffled playlist
    const shuffledPlaylist = {
      ...playlist,
      songIds: shuffled.map(song => song.id),
    };

    setCurrentPlaylist(shuffledPlaylist);
    await playSong(shuffled[0]);
  };

  const seekToPosition = async (positionMillis) => {
    try {
      if (!soundRef.current || !isLoaded) return;
      await soundRef.current.setPositionAsync(positionMillis);
    } catch (err) {
      console.error('Error seeking:', err);
    }
  };

  const openCreatePlaylist = () => {
    setCreatePlaylistVisible(true);
    console.log('Opening Create Playlist modal');
  };

  const closeCreatePlaylist = () => {
    setCreatePlaylistVisible(false);
    console.log('Closing Create Playlist modal');
  };

  const generatePlaylistId = () => {
    return `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addPlaylist = (name) => {
    const newPlaylist = {
      id: generatePlaylistId(),
      name: name.trim(),
      songIds: [],
    };
    setPlaylists([...playlists, newPlaylist]);
    console.log('Created new playlist:', newPlaylist.name);
  };

  const openAddToPlaylist = (song) => {
    setAddToPlaylistTargetSong(song);
    setAddToPlaylistVisible(true);
    console.log('Opening Add to Playlist modal for:', song.title);
  };

  const closeAddToPlaylist = () => {
    setAddToPlaylistVisible(false);
    setAddToPlaylistTargetSong(null);
    console.log('Closing Add to Playlist modal');
  };

  const openDeleteConfirmation = (type, item, onConfirm) => {
    setDeleteConfirmationData({ type, item, onConfirm });
    setDeleteConfirmationVisible(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
    setDeleteConfirmationData(null);
  };

  const addSongToPlaylist = (songId, playlistId) => {
    setPlaylists(prevPlaylists =>
      prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          if (!playlist.songIds.includes(songId)) {
            return {
              ...playlist,
              songIds: [...playlist.songIds, songId]
            };
          }
        }
        return playlist;
      })
    );
  };

  const addSongToMultiplePlaylists = (songId, playlistIds) => {
    playlistIds.forEach(playlistId => {
      addSongToPlaylist(songId, playlistId);
    });
    console.log(`Added song ${songId} to ${playlistIds.length} playlists`);
  };

  const deletePlaylist = (playlistId) => {
    // If this playlist is currently playing, stop playback
    if (currentPlaylist?.id === playlistId) {
      if (soundRef.current) {
        soundRef.current.pauseAsync();
      }
      setCurrentSong(null);
      setCurrentPlaylist(null);
      setNowPlayingVisible(false);
    }

    // Remove from playlists array
    setPlaylists(playlists.filter(p => p.id !== playlistId));
    console.log('Deleted playlist:', playlistId);
  };

  const removeSongFromPlaylist = (songId, playlistId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const updatedSongIds = playlist.songIds.filter(id => id !== songId);

        // Handle if currently playing song from this playlist
        if (currentPlaylist?.id === playlistId && currentSong?.id === songId) {
          playNextSong(); // Auto-advance to next song
        }

        return { ...playlist, songIds: updatedSongIds };
      }
      return playlist;
    }));
    console.log(`Removed song ${songId} from playlist ${playlistId}`);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        nowPlayingVisible,
        currentPlaylist,
        playlistDetailVisible,
        selectedPlaylist,
        playlists,
        createPlaylistVisible,
        addToPlaylistVisible,
        addToPlaylistTargetSong,
        deleteConfirmationVisible,
        deleteConfirmationData,
        positionMillis,
        durationMillis,
        isBuffering,
        isLoaded,
        error,
        setCurrentSong: playSong,
        togglePlayPause,
        playPreviousSong,
        playNextSong,
        seekToPosition,
        openNowPlaying,
        closeNowPlaying,
        openPlaylistDetail,
        closePlaylistDetail,
        openCreatePlaylist,
        closeCreatePlaylist,
        addPlaylist,
        openAddToPlaylist,
        closeAddToPlaylist,
        openDeleteConfirmation,
        closeDeleteConfirmation,
        addSongToPlaylist,
        addSongToMultiplePlaylists,
        deletePlaylist,
        removeSongFromPlaylist,
        playSongFromPlaylist,
        playPlaylist,
        shufflePlaylist,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
