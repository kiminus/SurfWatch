import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import Header from './components/Header';
import TabBar from './components/TabBar';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import MapScreen from './screens/Map/MapScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Render the active screen based on the selected tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'map':
        return <MapScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />
      {renderScreen()}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});