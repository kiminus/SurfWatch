// src/screens/ProfileScreen/ProfileHeader.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../../utils/colors';

export default function ProfileHeader() {
  return (
    <View style={styles.profileInfo}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          <Ionicons name="person-outline" size={40} color={colors.mediumGray} />
        </View>
        <View style={styles.editIconContainer}>
          <Feather name="edit-2" size={16} color="#000" />
        </View>
      </View>
      <Text style={styles.profileName}>Jane Doe</Text>
      
      <View style={styles.skillLevel}>
        <View style={[styles.skillDot, {backgroundColor: colors.primary}]} />
        <View style={[styles.skillDot, {backgroundColor: colors.primary}]} />
        <View style={[styles.skillDot, {borderColor: colors.primary, borderWidth: 2}]} />
        <Text style={styles.skillText}>INTERMEDIATE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  skillLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillDot: {
    width: 24,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  skillText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.mediumGray,
  },
});