import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const TabSwitcher = ({ activeTab, onTabPress }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'songs' && styles.activeTab]}
      onPress={() => onTabPress('songs')}
    >
      <Text style={[styles.tabText, activeTab === 'songs' && styles.activeTabText]}>
        All Songs
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
      onPress={() => onTabPress('playlists')}
    >
      <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>
        Playlists
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default TabSwitcher;