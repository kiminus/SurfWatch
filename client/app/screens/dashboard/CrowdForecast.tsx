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
      { time: "08:00", level: 10 },
      { time: "10:00", level: 15 },
      { time: "12:00", level: 20 },
      { time: "14:00", level: 18 },
      { time: "16:00", level: 12 }
    ]
  },
  {
    location: 'Scripps',
    crowds: [
      { time: "08:00", level: 8 },
      { time: "10:00", level: 12 },
      { time: "12:00", level: 16 },
      { time: "14:00", level: 14 },
      { time: "16:00", level: 10 }
    ]
  },
  {
    location: 'Pipes',
    crowds: [
      { time: "08:00", level: 5 },
      { time: "10:00", level: 8 },
      { time: "12:00", level: 12 },
      { time: "14:00", level: 10 },
      { time: "16:00", level: 6 }
    ]
  },
  {
    location: 'Pacific Beach',
    crowds: [
      { time: "08:00", level: 18 },
      { time: "10:00", level: 22 },
      { time: "12:00", level: 25 },
      { time: "14:00", level: 20 },
      { time: "16:00", level: 15 }
    ]
  }
];

// Days of the week
const days = ['FRI', 'SAT', 'SUN', 'MON', 'TUES'];

export default function CrowdForecast() {
  function getStyleFromCrowdLevel(level: number) {
    if (level < 10) {
      return [styles.crowdDot, { backgroundColor: colors.green }];
    } else if (level < 20) {
      return [styles.crowdDot, { backgroundColor: colors.yellow }];
    } else {
      return [styles.crowdDot, { backgroundColor: colors.red }];
    }
  }

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
                style={getStyleFromCrowdLevel(crowd.level)} 
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