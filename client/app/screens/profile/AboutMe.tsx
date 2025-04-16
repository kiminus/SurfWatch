// src/screens/ProfileScreen/AboutMe.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../../utils/colors';

// Favorite beaches data
const favoriteBeaches = [
  { id: 1, name: 'LA JOLLA SHORES, SAN DIEGO' },
  { id: 2, name: 'SCRIPPS, SAN DIEGO' },
  { id: 3, name: 'PIPELINE, OAHU' },
];

export default function AboutMe() {
  return (
    <View style={styles.container}>
      <View style={styles.aboutMeItem}>
        <Text style={styles.aboutMeLabel}>Home Beach</Text>
        <View style={styles.aboutMeValue}>
          <Ionicons name="water" size={18} color="#000" />
          <Text style={styles.aboutMeText}>LA JOLLA SHORES, SAN DIEGO</Text>
        </View>
      </View>
      
      <View style={styles.aboutMeItem}>
        <Text style={styles.aboutMeLabel}>Ideal Surf Day</Text>
        <View style={styles.aboutMeRow}>
          <Ionicons name="time-outline" size={18} color="#000" />
          <Text style={styles.aboutMeText}>3:30 PM</Text>
        </View>
        <View style={styles.aboutMeRow}>
          <Ionicons name="sunny-outline" size={18} color="#000" />
          <Text style={styles.aboutMeText}>70°F - 80°F</Text>
        </View>
        <View style={styles.aboutMeRow}>
          <MaterialIcons name="waves" size={18} color="#000" />
          <Text style={styles.aboutMeText}>2-3 FT</Text>
        </View>
      </View>
      
      <View style={styles.aboutMeItem}>
        <Text style={styles.aboutMeLabel}>Favorite Beaches</Text>
        {favoriteBeaches.map(beach => (
          <View key={beach.id} style={styles.favoriteBeach}>
            <Text style={styles.favoriteBeachNumber}>{beach.id}.</Text>
            <Text style={styles.favoriteBeachName}>{beach.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  aboutMeItem: {
    marginBottom: 24,
  },
  aboutMeLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    marginBottom: 8,
  },
  aboutMeValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  aboutMeText: {
    marginLeft: 8,
    fontSize: 14,
  },
  favoriteBeach: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  favoriteBeachNumber: {
    width: 20,
    fontSize: 14,
  },
  favoriteBeachName: {
    fontSize: 14,
  },
});