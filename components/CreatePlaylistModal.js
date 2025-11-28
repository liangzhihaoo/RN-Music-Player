import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const CreatePlaylistModal = () => {
  const { createPlaylistVisible, closeCreatePlaylist, addPlaylist } = useMusicPlayer();
  const [playlistName, setPlaylistName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset input when modal opens
  useEffect(() => {
    if (createPlaylistVisible) {
      setPlaylistName('');
      setIsSubmitting(false);
    }
  }, [createPlaylistVisible]);

  const handleConfirm = () => {
    const trimmedName = playlistName.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    addPlaylist(trimmedName);
    Keyboard.dismiss();
    closeCreatePlaylist();
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    closeCreatePlaylist();
  };

  return (
    <Modal
      visible={createPlaylistVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent={true}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Create New Playlist</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter playlist name"
            placeholderTextColor="#999"
            value={playlistName}
            onChangeText={setPlaylistName}
            maxLength={50}
            autoFocus={true}
            onSubmitEditing={handleConfirm}
            returnKeyType="done"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 999,
    zIndex: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreatePlaylistModal;
