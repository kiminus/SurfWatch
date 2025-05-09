// screens/profile/ProfileScreen.tsx
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import colors from '../../utils/colors';
import { AppContext } from '@/app/contexts/AppContext';
import AuthService from '@/app/services/AuthService';
import { ScreenNavigator } from '@/app/models/shared';

const ProfileScreen: React.FC = () => {
  // State for settings
  const { user, navigate } = useContext(AppContext);
  const [showStreak, setShowStreak] = useState<boolean>(
    user?.show_streak || false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      await navigate(ScreenNavigator.Login);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle streak visibility setting
  const handleToggleStreak = async (value: boolean) => {
    setShowStreak(value);

    // In a real app, update the setting on the server
    try {
      // await apiClient.patch('/users/settings', { show_streak: value });
      console.log('Updated streak visibility setting:', value);
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Revert the switch if the API call fails
      setShowStreak(!value);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };

  // If no user data is available
  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarInitial}>{user.display_name}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.displayName}>{user.display_name}</Text>

        {showStreak ? (
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={16} color="#FF6B00" />
            <Text style={styles.streakText}>
              {user.streak_days} day{user.streak_days !== 1 ? 's' : ''} streak
            </Text>
          </View>
        ) : null}
      </View>

      {/* Profile Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>23</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Beaches</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4.2h</Text>
          <Text style={styles.statLabel}>Avg. Time</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="flame-outline"
              size={22}
              color={colors.dark}
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Show streak on profile</Text>
          </View>
          <Switch
            value={showStreak}
            onValueChange={handleToggleStreak}
            trackColor={{
              false: colors.lightGray,
              true: `${colors.primary}80`,
            }}
            thumbColor={showStreak ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.dark}
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Push notifications</Text>
          </View>
          <Switch
            value={true}
            trackColor={{
              false: colors.lightGray,
              true: `${colors.primary}80`,
            }}
            thumbColor={true ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons
              name="location-outline"
              size={22}
              color={colors.dark}
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Location services</Text>
          </View>
          <Switch
            value={true}
            trackColor={{
              false: colors.lightGray,
              true: `${colors.primary}80`,
            }}
            thumbColor={true ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="person-outline"
              size={22}
              color={colors.dark}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Edit Profile</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.mediumGray}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="bookmark-outline"
              size={22}
              color={colors.dark}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Saved Locations</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.mediumGray}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="card-outline"
              size={22}
              color={colors.dark}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Subscription</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.mediumGray}
          />
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={colors.dark}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Help Center</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.mediumGray}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons
              name="mail-outline"
              size={22}
              color={colors.dark}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Contact Us</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.mediumGray}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.logoutButtonText}>Log Out</Text>
        )}
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>SurfWatch v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.mediumGray,
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  streakText: {
    color: '#FF6B00',
    fontWeight: '500',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.mediumGray,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.lightGray,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 16,
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.dark,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.dark,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: colors.mediumGray,
    fontSize: 14,
    marginBottom: 30,
  },
});

export default ProfileScreen;
