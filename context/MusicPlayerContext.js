import React, { createContext, useContext, useState } from 'react';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

export const MusicPlayerProvider = ({ children, songs = [], playlists = [] }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingVisible, setNowPlayingVisible] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistDetailVisible, setPlaylistDetailVisible] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? 'Pausing...' : 'Playing...');
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

  const playPreviousSong = () => {
    if (!currentSong) return;

    // If playing from a playlist, navigate within playlist
    if (currentPlaylist) {
      const playlistSongs = currentPlaylist.songIds
        .map(id => songs.find(song => song.id === id))
        .filter(Boolean);

      if (playlistSongs.length === 0) return;

      const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : playlistSongs.length - 1;
      setCurrentSong(playlistSongs[previousIndex]);
      setIsPlaying(true);
      console.log('Playing previous song in playlist:', playlistSongs[previousIndex].title);
    } else {
      // Global navigation
      if (songs.length === 0) return;
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
      setCurrentSong(songs[previousIndex]);
      setIsPlaying(true);
      console.log('Playing previous song:', songs[previousIndex].title);
    }
  };

  const playNextSong = () => {
    if (!currentSong) return;

    // If playing from a playlist, navigate within playlist
    if (currentPlaylist) {
      const playlistSongs = currentPlaylist.songIds
        .map(id => songs.find(song => song.id === id))
        .filter(Boolean);

      if (playlistSongs.length === 0) return;

      const currentIndex = playlistSongs.findIndex(song => song.id === currentSong.id);
      const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
      setCurrentSong(playlistSongs[nextIndex]);
      setIsPlaying(true);
      console.log('Playing next song in playlist:', playlistSongs[nextIndex].title);
    } else {
      // Global navigation
      if (songs.length === 0) return;
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
      setCurrentSong(songs[nextIndex]);
      setIsPlaying(true);
      console.log('Playing next song:', songs[nextIndex].title);
    }
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    console.log('Now playing:', song.title);
  };

  const playSongFromPlaylist = (song, playlist) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
    console.log('Playing song from playlist:', song.title, 'in', playlist.name);
  };

  const playPlaylist = (playlist) => {
    const playlistSongs = playlist.songIds
      .map(id => songs.find(song => song.id === id))
      .filter(Boolean);

    if (playlistSongs.length === 0) return;

    setCurrentSong(playlistSongs[0]);
    setCurrentPlaylist(playlist);
    setIsPlaying(true);
    console.log('Playing playlist:', playlist.name, 'from first song');
  };

  const shufflePlaylist = (playlist) => {
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

    setCurrentSong(shuffled[0]);
    setCurrentPlaylist(shuffledPlaylist);
    setIsPlaying(true);
    console.log('Shuffling and playing playlist:', playlist.name);
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
        setCurrentSong: playSong,
        togglePlayPause,
        playPreviousSong,
        playNextSong,
        openNowPlaying,
        closeNowPlaying,
        openPlaylistDetail,
        closePlaylistDetail,
        playSongFromPlaylist,
        playPlaylist,
        shufflePlaylist,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
