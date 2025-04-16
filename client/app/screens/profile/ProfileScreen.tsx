// src/screens/ProfileScreen/index.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from './ProfileHeader';
import AboutMe from './AboutMe';
import colors from '../../utils/colors';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Ionicons name="flame" size={24} color={colors.primary} />
        <Text style={styles.streakText}>5 DAY SURFING STREAK</Text>
      </View>
      
      <ProfileHeader />
      
      <View style={styles.newStoryButton}>
        <Ionicons name="add" size={24} color="#000" />
        <Text style={styles.newStoryText}>new story</Text>
      </View>
      
      <View style={styles.profileTabs}>
        <TouchableOpacity 
          style={[styles.profileTab, activeTab === 'about' && styles.activeProfileTab]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.profileTabText, activeTab === 'about' && styles.activeProfileTabText]}>
            About Me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.profileTab, activeTab === 'buds' && styles.activeProfileTab]}
          onPress={() => setActiveTab('buds')}
        >
          <Text style={[styles.profileTabText, activeTab === 'buds' && styles.activeProfileTabText]}>
            Surf Buds
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'about' && <AboutMe />}
      {/* We're not implementing Surf Buds as per your request */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.primary,
  },
  newStoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  newStoryText: {
    fontSize: 14,
    color: colors.mediumGray,
    marginLeft: 4,
  },
  profileTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  profileTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeProfileTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  profileTabText: {
    fontSize: 16,
    color: colors.mediumGray,
  },
  activeProfileTabText: {
    color: '#000',
    fontWeight: '500',
  },
});