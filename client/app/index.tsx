// App.tsx
import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Components/Screens
import Header from './components/Header';
import TabBar from './components/TabBar';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import MapScreen from './screens/Map/MapScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

// Import Auth Components
import {
  LoadingScreen,
  LoginScreen,
  RegisterScreen,
} from './screens/auth/AuthScreens';
import { UserProfile } from './models/user';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Define Navigation Param Lists
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type AppStackParamList = {
  MainApp: undefined;
};

type RootStackParamList = AuthStackParamList & AppStackParamList;

// Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

// Main App Layout Component
const MainAppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<UserProfile>();

  // Render the active screen based on the selected tab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'map':
        return <MapScreen />;
      case 'profile':
        // Pass the user object from AuthContext to ProfileScreen
        return <ProfileScreen user={user} />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <>
      <Header />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

// Root Navigator Component
const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // User IS logged in: show the main app layout screen
        <Stack.Screen name="MainApp" component={MainAppLayout} />
      ) : (
        // User IS NOT logged in: show the auth screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
  },
});
