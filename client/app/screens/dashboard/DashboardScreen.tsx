// screens/dashboard/DashboardScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../utils/colors';
import { Site } from '../../models/site'; // Adjust the import path as necessary
import SiteService from '../../services/SiteService'; // Adjust the import path as necessary
import { AppContext } from '@/app/contexts/AppContext';
import { ScreenNavigator } from '@/app/models/shared';

const DashboardScreen: React.FC = () => {
  const [recommendedSites, setRecommendedSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { currentSite, setCurrentSite, navigate } = useContext(AppContext);

  // --------------- Config ---------------
  const LOW_CROWD_LEVEL = 5;
  const MEDIUM_CROWD_LEVEL = 10;
  const HIGH_CROWD_LEVEL = 15;

  // Fetch recommended surf sites
  const fetchRecommendedSites = async () => {
    if (!recommendedSites) return;
    try {
      setError(null);
      setRecommendedSites(
        await SiteService.getAllSites(currentSite, setCurrentSite)
      );
    } catch (err) {
      console.error('Error fetching recommended sites:', err);
      setError('Unable to load recommendations. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRecommendedSites();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchRecommendedSites();
  };
  // helper function to get current crowd level
  const getCrowdLevel = (site: Site): number => {
    // get the current hour crowd level for the site, first get the current hour
    const currentHour = new Date().getHours();
    // then, get the crowd level for each hour, eg: 0 -> h0
    switch (currentHour) {
      case 0:
        return site.daily_prediction!.h0;
      case 1:
        return site.daily_prediction!.h1;
      case 2:
        return site.daily_prediction!.h2;
      case 3:
        return site.daily_prediction!.h3;
      case 4:
        return site.daily_prediction!.h4;
      case 5:
        return site.daily_prediction!.h5;
      case 6:
        return site.daily_prediction!.h6;
      case 7:
        return site.daily_prediction!.h7;
      case 8:
        return site.daily_prediction!.h8;
      case 9:
        return site.daily_prediction!.h9;
      case 10:
        return site.daily_prediction!.h10;
      case 11:
        return site.daily_prediction!.h11;
      case 12:
        return site.daily_prediction!.h12;
      case 13:
        return site.daily_prediction!.h13;
      case 14:
        return site.daily_prediction!.h14;
      case 15:
        return site.daily_prediction!.h15;
      case 16:
        return site.daily_prediction!.h16;
      case 17:
        return site.daily_prediction!.h17;
      case 18:
        return site.daily_prediction!.h18;
      case 19:
        return site.daily_prediction!.h19;
      case 20:
        return site.daily_prediction!.h20;
      case 21:
        return site.daily_prediction!.h21;
      case 22:
        return site.daily_prediction!.h22;
      case 23:
        return site.daily_prediction!.h23;
      default:
        return 0; // Default value if hour is somehow out of range
    }
  };

  // Helper function to get crowd indicator color
  const getCrowdColor = (level: number): string => {
    if (level < LOW_CROWD_LEVEL) return colors.green;
    if (level < MEDIUM_CROWD_LEVEL) return colors.lime;
    if (level < HIGH_CROWD_LEVEL) return colors.yellow;
    return colors.orange;
  };

  // Helper function to render crowd level text
  const getCrowdText = (level: number): string => {
    // console.log('Crowd level:', level);
    if (level < LOW_CROWD_LEVEL) return 'Low';
    if (level < MEDIUM_CROWD_LEVEL) return 'Moderate';
    if (level < HIGH_CROWD_LEVEL) return 'Busy';
    return 'Crowded';
  };

  // Render individual site card
  const renderSiteCard = ({ item }: { item: Site }) => {
    // For demo, generate random crowd level between 1-10

    return (
      <TouchableOpacity
        style={styles.siteCard}
        onPress={() => {
          // when pressed, navigate to the Map screen with the site ID
          console.log('Navigate to Map screen with site:', item);
          setCurrentSite(item);
          // navigate to the Map screen
          navigate(ScreenNavigator.Map);
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.siteName}>{item.site_name}</Text>
            <View
              style={[
                styles.crowdIndicator,
                { backgroundColor: getCrowdColor(getCrowdLevel(item)) },
              ]}
            >
              <Text style={styles.crowdText}>
                {getCrowdText(getCrowdLevel(item))}
              </Text>
            </View>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={18} color={colors.blue} />
              <Text style={styles.detailText}>3-4 ft</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={18} color={colors.dark} />
              <Text style={styles.detailText}>Best time: 7-9 AM</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading surf spots...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Today's Surf Report</Text>
        <Text style={styles.welcomeSubtitle}>
          Check out the best spots to catch waves today
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recommended Spots</Text>
        <FlatList
          data={recommendedSites}
          keyExtractor={(item) => item.site_id.toString()}
          renderItem={renderSiteCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No recommendations available</Text>
            </View>
          }
        />
      </View>
    </View>
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
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.dark,
  },
  welcomeSection: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.dark,
  },
  listContent: {
    paddingBottom: 20,
  },
  siteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  crowdIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  crowdText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.mediumGray,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
  },
  emptyList: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.mediumGray,
    textAlign: 'center',
  },
});

export default DashboardScreen;
