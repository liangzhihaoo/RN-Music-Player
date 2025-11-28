import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

export const MusicPlayerProvider = ({ children, songs = [], initialPlaylists = [] }) => {
  const { user } = useAuth();
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

  // Load playlists from Supabase on mount
  useEffect(() => {
    const loadPlaylists = async () => {
      if (!user) {
        setPlaylists([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('playlists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Transform from Supabase format to app format
        const transformedPlaylists = data.map(p => ({
          id: p.id.toString(),
          name: p.name,
          songIds: p.song_ids || []
        }));

        setPlaylists(transformedPlaylists);
      } catch (error) {
        console.error('Failed to load playlists:', error);
        setPlaylists([]);
      }
    };

    loadPlaylists();
  }, [user]);

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

  const addPlaylist = async (name) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert([{
          user_id: user.id,
          name: name.trim(),
          song_ids: []
        }])
        .select()
        .single();

      if (error) throw error;

      const newPlaylist = {
        id: data.id.toString(),
        name: data.name,
        songIds: data.song_ids || []
      };

      setPlaylists([...playlists, newPlaylist]);
      console.log('Created new playlist:', newPlaylist.name);
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
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

  const addSongToPlaylist = async (songId, playlistId) => {
    // Optimistic update
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

    // Sync to Supabase
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      const updatedSongIds = [...playlist.songIds];
      if (!updatedSongIds.includes(songId)) {
        updatedSongIds.push(songId);
      }

      const { error } = await supabase
        .from('playlists')
        .update({ song_ids: updatedSongIds })
        .eq('id', parseInt(playlistId));

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update playlist:', error);
    }
  };

  const addSongToMultiplePlaylists = (songId, playlistIds) => {
    playlistIds.forEach(playlistId => {
      addSongToPlaylist(songId, playlistId);
    });
    console.log(`Added song ${songId} to ${playlistIds.length} playlists`);
  };

  const deletePlaylist = async (playlistId) => {
    // If this playlist is currently playing, stop playback
    if (currentPlaylist?.id === playlistId) {
      if (soundRef.current) {
        soundRef.current.pauseAsync();
      }
      setCurrentSong(null);
      setCurrentPlaylist(null);
      setNowPlayingVisible(false);
    }

    // Optimistic delete
    setPlaylists(playlists.filter(p => p.id !== playlistId));

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', parseInt(playlistId));

      if (error) throw error;
      console.log('Deleted playlist:', playlistId);
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const removeSongFromPlaylist = async (songId, playlistId) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const updatedSongIds = playlist.songIds.filter(id => id !== songId);

        // Handle if currently playing song from this playlist
        if (currentPlaylist?.id === playlistId && currentSong?.id === songId) {
          playNextSong();
        }

        return { ...playlist, songIds: updatedSongIds };
      }
      return playlist;
    }));

    // Sync to Supabase
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      const { error } = await supabase
        .from('playlists')
        .update({ song_ids: playlist.songIds.filter(id => id !== songId) })
        .eq('id', parseInt(playlistId));

      if (error) throw error;
      console.log(`Removed song ${songId} from playlist ${playlistId}`);
    } catch (error) {
      console.error('Failed to remove song from playlist:', error);
    }
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
