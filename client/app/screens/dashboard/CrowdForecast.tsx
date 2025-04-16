// src/screens/HomeScreen/CrowdForecast.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/colors';

// Crowd forecast data
const forecastData = [
  {
    location: 'La Jolla Shores',
    crowds: [
      { level: 'medium', color: colors.yellow },
      { level: 'high', color: colors.orange },
      { level: 'medium', color: colors.yellow },
      { level: 'low', color: colors.green, large: true },
      { level: 'low', color: colors.green }
    ]
  },
  {
    location: 'Scripps',
    crowds: [
      { level: 'low', color: colors.green, large: true },
      { level: 'high', color: colors.orange },
      { level: 'medium', color: colors.yellow },
      { level: 'low', color: colors.green },
      { level: 'low', color: colors.green }
    ]
  },
  {
    location: 'Pipes',
    crowds: [
      { level: 'low', color: colors.green },
      { level: 'medium-low', color: colors.lime },
      { level: 'medium', color: colors.yellow },
      { level: 'low', color: colors.green },
      { level: 'low', color: colors.green, large: true }
    ]
  },
  {
    location: 'Pacific Beach',
    crowds: [
      { level: 'medium-low', color: colors.lime },
      { level: 'high', color: colors.orange },
      { level: 'medium', color: colors.yellow },
      { level: 'low', color: colors.green },
      { level: 'low', color: colors.green }
    ]
  }
];

// Days of the week
const days = ['FRI', 'SAT', 'SUN', 'MON', 'TUES'];

export default function CrowdForecast() {
  return (
    <View style={styles.container}>
      <View style={styles.forecastHeader}>
        <Text style={styles.forecastTitle}>Crowd Forecast</Text>
        <Ionicons name="information-circle-outline" size={24} color={colors.mediumGray} />
      </View>
      
      <View style={styles.dayLabels}>
        {days.map((day, index) => (
          <Text key={index} style={styles.dayLabel}>{day}</Text>
        ))}
      </View>
      
      {forecastData.map((item, index) => (
        <View key={index} style={styles.locationForecast}>
          <Text style={styles.locationName}>{item.location}</Text>
          <View style={styles.crowdDots}>
            {item.crowds.map((crowd, crowdIndex) => (
              <View 
                key={crowdIndex} 
                style={[
                  styles.crowdDot, 
                  { 
                    backgroundColor: crowd.color,
                    width: crowd.large ? 32 : 24,
                    height: crowd.large ? 32 : 24,
                  }
                ]} 
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  forecastTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 14,
    color: colors.mediumGray,
    width: '20%',
    textAlign: 'center',
  },
  locationForecast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    width: '30%',
  },
  crowdDots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
  },
  crowdDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});