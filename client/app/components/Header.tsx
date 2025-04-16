import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/colors';

export default function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>SurfWatch</Text>
      <TouchableOpacity>
        <Ionicons name="search" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});