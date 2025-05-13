// App.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';

// Import Components/Screens
import Header from './components/Header';
import TabBar from './components/TabBar';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import MapScreen from './screens/Map/MapScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

// Import Auth Components
import { LoginScreen, RegisterScreen } from './screens/auth/AuthScreens';
import { UserProfile } from './models/user';
import { AppContext } from './contexts/AppContext';
import { ScreenNavigator } from './models/shared';
import AuthService from './services/AuthService';
import { Site } from './models/site';

// Main App Layout Component
const MainAppLayout: React.FC<{ tab?: ScreenNavigator }> = ({ tab }) => {
  const {currentScreen, navigate} = React.useContext(AppContext);
  // Render the active screen based on the selected tab
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenNavigator.Home:
        return <DashboardScreen />;
      case ScreenNavigator.Map:
        return <MapScreen />;
      case ScreenNavigator.Profile:
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <>
      <Header />
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <TabBar activeTab={currentScreen} setActiveTab={navigate} />
    </>
  );
};

const ServiceProviders: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenNavigator>(
    ScreenNavigator.Home
  );
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  React.useEffect(() => {
    if (user) {
      console.log('User profile updated, navigate to profile:', user);
      setCurrentScreen(ScreenNavigator.Profile);
    } else {
      console.log('User profile is null, navigate to login');
      setCurrentScreen(ScreenNavigator.Login);
    }
  }, [user]);
  /*
   * navigation stack service
   */
  const navigationStack: Record<ScreenNavigator, React.JSX.Element> = {
    login: <LoginScreen />,
    register: <RegisterScreen />,
    home: <MainAppLayout tab={ScreenNavigator.Home} />,
    map: <MainAppLayout tab={ScreenNavigator.Map} />,
    profile: <MainAppLayout tab={ScreenNavigator.Profile} />,
    search: <MainAppLayout tab={ScreenNavigator.Search} />,
  };

  /*
   * navigate to a selected screen. it will ignore checks
   * @param screen - The screen to navigate to
   */
  const navigate = async (screen: ScreenNavigator) => {
    console.log('Navigating to screen:', screen);
    setCurrentScreen(screen);
    return screen;
  };

  // try to get current user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await AuthService.getCurrentUser(setUser);
        console.log('User profile:', userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setCurrentScreen(ScreenNavigator.Login);
      }
    };
    fetchUserProfile();
  }, []);
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentScreen,
        navigate,
        currentSite,
        setCurrentSite,
      }}
    >
      {navigationStack[currentScreen]}
    </AppContext.Provider>
  );
};
// Main App Component
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ServiceProviders />
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
