import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const DeleteConfirmationModal = () => {
  const {
    deleteConfirmationVisible,
    deleteConfirmationData,
    closeDeleteConfirmation,
  } = useMusicPlayer();

  if (!deleteConfirmationData) {
    return null;
  }

  const { type, item, onConfirm } = deleteConfirmationData;

  const getTitle = () => {
    return type === 'playlist' ? 'Delete Playlist?' : 'Delete Song?';
  };

  const getMessage = () => {
    if (type === 'playlist') {
      return `Are you sure you want to delete "${item.name}"?`;
    } else {
      return `Are you sure you want to remove "${item.title}" from this playlist?`;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeDeleteConfirmation();
  };

  const handleCancel = () => {
    closeDeleteConfirmation();
  };

  return (
    <Modal
      visible={deleteConfirmationVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.container}>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.message}>{getMessage()}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
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
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DeleteConfirmationModal;
