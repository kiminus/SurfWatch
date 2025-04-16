// src/screens/MapScreen/CrowdChart.js
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../utils/colors';

// Chart data - height percentages for each hour
const chartData = [
  { time: '9 am', height: 40 },
  { time: '12 pm', height: 35 },
  { time: '3 pm', height: 75, highlight: true },
  { time: '6 pm', height: 30 },
];

export default function CrowdChart() {
  return (
    <View style={styles.container}>
      <View style={styles.hourlyBars}>
        {chartData.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.hourBar, 
              { 
                height: `${item.height}%`,
                backgroundColor: item.highlight ? colors.primary : colors.blue 
              }
            ]} 
          />
        ))}
      </View>
      <View style={styles.hourLabels}>
        {chartData.map((item, index) => (
          <Text key={index} style={styles.hourLabel}>{item.time}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  hourlyBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    alignItems: 'flex-end',
  },
  hourBar: {
    backgroundColor: colors.blue,
    width: '22%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  hourLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hourLabel: {
    fontSize: 12,
    color: colors.mediumGray,
  },
});