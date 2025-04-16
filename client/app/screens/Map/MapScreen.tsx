// src/screens/MapScreen/index.js
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CrowdChart from './CrowdChart';
import colors from '../../utils/colors';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/placeholder.png')} 
        style={styles.mapImage}
        defaultSource={require('../../../assets/images/placeholder.png')}
      />
      
      <View style={styles.mapOverlay}>
        <Text style={styles.forecastTitle}>Crowd Forecast</Text>
        <View style={styles.weatherContainer}>
          <Ionicons name="cloud" size={18} color="#fff" />
          <Text style={styles.weatherText}>65°</Text>
        </View>
      </View>
      
      <View style={styles.mapLocation}>
        <Text style={styles.mapLocationText}>Scripps Pier, San Diego CA</Text>
      </View>
      
      <CrowdChart />
      
      <View style={styles.mapMessage}>
        <Text style={styles.mapMessageText}>
          Not as crowded as usual, get ready to catch some waves!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '60%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  forecastTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  weatherText: {
    color: 'white',
    marginLeft: 4,
  },
  mapLocation: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  mapLocationText: {
    fontSize: 18,
    fontWeight: '600',
  },
  mapMessage: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  mapMessageText: {
    fontSize: 16,
    color: '#333',
  },
});