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

// Main App Layout Component
const MainAppLayout: React.FC<{ tab?: ScreenNavigator }> = ({ tab }) => {
  const [activeTab, setActiveTab] = useState<ScreenNavigator>(
    tab || ScreenNavigator.Home
  );

  // Render the active screen based on the selected tab
  const renderScreen = () => {
    switch (activeTab) {
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
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

const ServiceProviders: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenNavigator>(
    ScreenNavigator.Home
  );
  /*
   * navigation stack service
   */
  const navigationStack: Record<string, React.JSX.Element> = {
    login: <LoginScreen />,
    register: <RegisterScreen />,
    home: <MainAppLayout tab={ScreenNavigator.Home} />,
    map: <MainAppLayout tab={ScreenNavigator.Map} />,
    profile: <MainAppLayout tab={ScreenNavigator.Profile} />,
  };

  /*
   * navigate to a selected screen. if `user` is null, forced to login
   * @param screen - The screen to navigate to
   */
  const navigate = (screen: ScreenNavigator) => {
    console.log('Navigating to screen:', screen);
    if (
      screen === ScreenNavigator.Login ||
      screen === ScreenNavigator.Register
    ) {
      setCurrentScreen(screen);
      return screen;
    }

    // For other screens, require user to be logged in
    if (!user) {
      setCurrentScreen(ScreenNavigator.Login);
      return ScreenNavigator.Login;
    }

    // User is logged in, allow navigation to the requested screen
    console.log('user is logged in', user);
    setCurrentScreen(screen);
    return screen;
  };

  // try to get current user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await AuthService.getCurrentUser();
        if (userProfile) {
          setUser(userProfile);
          setCurrentScreen(ScreenNavigator.Home);
        } else {
          setCurrentScreen(ScreenNavigator.Login);
        }
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
