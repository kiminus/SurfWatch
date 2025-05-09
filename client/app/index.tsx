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
  const navigate = async (screen: ScreenNavigator) => {
    console.log('Navigating to screen:', screen);
    if (
      screen === ScreenNavigator.Login ||
      screen === ScreenNavigator.Register
    ) {
      console.log('user login/register screen is allowed to navigate at any time');
      setCurrentScreen(screen);
      return screen;
    }

    // For other screens, require user to be logged in
    if (!user) {
      console.log('user is not logged in, redirecting to login'); // Kept from original selection
      
      const userBecameAvailable = await new Promise<boolean>((resolve) => {
        let attempts = 0;
        const maxAttempts = 4; // Controls the number of attempts (4 times)
        const intervalMs = 50; // Interval duration (50ms)

        const intervalId = setInterval(() => {
          // `user` refers to the state variable from the ServiceProviders component's scope.
          // It will reflect changes if `setUser` is called elsewhere.
          if (user) {
            clearInterval(intervalId);
            resolve(true); // User state is now populated
          } else {
            attempts++;
            // Kept from original selection, this will log on each attempt where user is null
            console.log('waiting for user to update ...'); 
            if (attempts >= maxAttempts) {
              clearInterval(intervalId);
              resolve(false); // Timed out, user state still not populated
            }
          }
        }, intervalMs);
      });

      if (!userBecameAvailable) {
        // If user state did not update within the timeout period (promise resolved to false),
        // then set current screen to Login and return.
        setCurrentScreen(ScreenNavigator.Login);
        return ScreenNavigator.Login;
      }
      // If userBecameAvailable is true, it means `user` is now non-null.
      // The code will fall through to the part after the `if (!user)` block
      // in the navigate function, allowing navigation to the originally requested screen.
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
        setUser(userProfile);
        await navigate(ScreenNavigator.Home);
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
