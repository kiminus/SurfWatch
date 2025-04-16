// src/screens/Dashboard
import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecommendedSpot from './RecommendedSpot';
import CrowdForecast from './CrowdForecast';
import colors from '../../utils/colors';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.streakContainer}>
        <Ionicons name="flame" size={24} color={colors.primary} />
        <Text style={styles.streakText}>4 DAY SURFING STREAK</Text>
      </View>
      
      
      <Text style={styles.sectionTitle}>Recommended</Text>
      
      <RecommendedSpot 
        name="La Jolla Shores"
        time="6:30 AM"
        imageSource={require('../../../assets/images/placeholder.png')}
      />
      
      <CrowdForecast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});