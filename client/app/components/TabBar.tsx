import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../utils/colors';
import { ScreenNavigator } from '../models/shared';

interface TabBarProps {
  activeTab: ScreenNavigator;
  setActiveTab: (tab: ScreenNavigator) => void;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setActiveTab(ScreenNavigator.Home)}
      >
        <Ionicons
          name={activeTab === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={activeTab === 'home' ? colors.primary : '#000'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setActiveTab(ScreenNavigator.Map)}
      >
        <MaterialIcons
          name="surfing"
          size={28}
          color={activeTab === 'map' ? colors.primary : '#000'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setActiveTab(ScreenNavigator.Profile)}
      >
        <Ionicons
          name={activeTab === 'profile' ? 'person' : 'person-outline'}
          size={24}
          color={activeTab === 'profile' ? colors.primary : '#000'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
