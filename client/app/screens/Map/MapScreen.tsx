// src/screens/MapScreen/index.js
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CrowdChart from './CrowdChart';
import colors from '../../utils/colors';
import { AppContext } from '@/app/contexts/AppContext';

export default function MapScreen() {
  const { currentSite } = useContext(AppContext);
  useEffect(() => {
    // Fetch map data or perform any necessary setup here
    if (currentSite) {
      console.log('Current site:', currentSite);
    } else {
      console.log('No current site selected');
    }
  }, [currentSite]);
  return currentSite ? (
    <View style={styles.container}>
      <Image
        source={{ uri: currentSite.site_banner_url || '' }}
        style={styles.mapImage}
      />

      <View style={styles.mapOverlay}>
        <Text style={styles.forecastTitle}>Crowd Forecast</Text>
        <View style={styles.weatherContainer}>
          <Ionicons name="cloud" size={18} color="#fff" />
          <Text style={styles.weatherText}>65°</Text>
        </View>
      </View>

      <View style={styles.mapLocation}>
        <Text style={styles.mapLocationText}>{currentSite.site_name}</Text>
      </View>

      <CrowdChart />

      <View style={styles.mapMessage}>
        <Text style={styles.mapMessageText}>
          Not as crowded as usual, get ready to catch some waves!
        </Text>
      </View>
    </View>
  ) : (
    // Fallback UI when no site is selected
    <View style={styles.container}>
      <Text style={styles.mapMessageText}>
        Please select a surf site to view the map.
      </Text>
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
