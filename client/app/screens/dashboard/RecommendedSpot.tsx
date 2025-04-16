import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import colors from '../../utils/colors';

interface RecommendedSpotProps {
  name: string;
  time: string;
  imageSource: any;
}

export default function RecommendedSpot({ name, time, imageSource }: RecommendedSpotProps) {
  return (
    <View style={styles.spotCard}>
      <Image 
        source={imageSource} 
        style={styles.spotImage}
        defaultSource={require('../../../assets/images/placeholder.png')}
      />
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{name}</Text>
        <Text style={styles.spotDetail}>
          Crowds Lowest at <Text style={styles.highlightText}>{time}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spotCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  spotImage: {
    width: '100%',
    height: 150,
  },
  spotInfo: {
    padding: 12,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  spotDetail: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  highlightText: {
    color: colors.primary,
  },
});