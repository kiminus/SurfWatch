// src/screens/ProfileScreen/index.js
import React, { Dispatch, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileHeader from './ProfileHeader';
import AboutMe from './AboutMe';
import colors from '../../utils/colors';
import {User} from '@/app/models/user';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('about');
  const [user, setUser]: [User, Dispatch<User>] = useState({
    user_id: 1,
    user_name: 'John Doe',
    email: 'john@gmail.com',
    avatar_url: 'https://example.com/avatar.jpg',
    display_name: 'John HAll',
    streak_days: 5,
  })

  useEffect(() => {
    // fetch user data from `/user/{userid}/`
    fetch('/user/')
  },[]);
  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Ionicons name="flame" size={24} color={colors.primary} />
        <Text style={styles.streakText}>{user.streak_days} DAY SURFING STREAK</Text>
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
      </View>
      
      {activeTab === 'about' && <AboutMe user = {user} setUser = {setUser}/>}
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