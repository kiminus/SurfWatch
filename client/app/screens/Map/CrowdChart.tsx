// src/screens/MapScreen/CrowdChart.js
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native'; // Import Dimensions
import colors from '../../utils/colors';
import { AppContext } from '@/app/contexts/AppContext';

export default function CrowdChart() {
  const { currentSite } = useContext(AppContext);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );

  let maxCrowdLevel = 0;

  useEffect(() => {
    const onChange = ({ window }) => {
      setScreenWidth(window.width);
    };
    // Subscribe to dimension changes
    const subscription = Dimensions.addEventListener('change', onChange);
    // Unsubscribe on component unmount
    return () => subscription?.remove();
  }, []);

  const getCurrentHour = () => {
    return new Date().getHours();
  };

  // Transform DailyCrowdnessPrediction data into chart format
  const getChartData = () => {
    if (!currentSite?.daily_prediction) return [];

    const currentHour = getCurrentHour();
    // Map all 24 hours
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const fieldName = `h${hour}`;

      // Format the time display
      let timeDisplay;
      if (hour === 0) timeDisplay = '12 am';
      else if (hour < 12) timeDisplay = `${hour} am`;
      else if (hour === 12) timeDisplay = '12 pm';
      else timeDisplay = `${hour - 12} pm`;

      // @ts-ignore
      const crowdLevel = currentSite.daily_prediction[fieldName] || 0;
      maxCrowdLevel = Math.max(maxCrowdLevel, crowdLevel);

      return {
        time: timeDisplay,
        height: crowdLevel,
        highlight: hour === currentHour,
        originalHour: hour, // Keep original hour for label logic
      };
    });
  };

  const displayData = getChartData();

  // Determine the label display interval based on screen width
  const getLabelDisplayInterval = () => {
    if (screenWidth < 380) {
      // Example threshold for small screens
      return 6; // Show every 6th label
    } else if (screenWidth < 500) {
      // Example threshold for medium-small screens
      return 4; // Show every 4th label
    }
    return 3; // Default: show every 3rd label
  };

  const labelInterval = getLabelDisplayInterval();

  return (
    <View style={styles.container}>
      <View style={styles.hourlyBars}>
        {displayData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.hourBar,
              {
                height:
                  maxCrowdLevel > 0
                    ? `${(item.height / maxCrowdLevel) * 100}%`
                    : '0%', // Handle maxCrowdLevel being 0
                backgroundColor: item.highlight ? colors.primary : colors.blue,
                width: `${90 / displayData.length}%`, // Adjust width based on number of bars
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.hourLabels}>
        {displayData.map((item, index) => {
          // Logic to decide if a label should be visible
          // We want to ensure the first (0h/12am) and mid (12h/12pm) labels are often shown if possible,
          // or adjust to show labels at more regular intervals.
          // The current logic uses originalHour to decide.
          const isVisible = item.originalHour % labelInterval === 0;

          return (
            <Text
              key={index}
              style={[
                styles.hourLabel,
                !isVisible && { opacity: 0 }, // Hide label if not visible
                // Add a fixed width to labels to prevent them from shifting other labels
                // You might need to adjust this width based on your font size and longest label ("12 am")
                { width: `${90 / displayData.length}%`, textAlign: 'center' },
              ]}
            >
              {item.time}
            </Text>
          );
        })}
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
    justifyContent: 'space-between', // This will distribute space between items
    height: 100,
    alignItems: 'flex-end',
    marginBottom: 8, // Added margin to separate bars from labels
  },
  hourBar: {
    backgroundColor: colors.blue,
    // width: '22%', // Width is now dynamic
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  hourLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This will distribute space between items
    // marginTop: 8, // Removed as margin bottom added to hourlyBars
  },
  hourLabel: {
    fontSize: 10, // Slightly reduced font size for better fit on small screens
    color: colors.mediumGray,
    // textAlign: 'center', // textAlign is now set dynamically
  },
});
