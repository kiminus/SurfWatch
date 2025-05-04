// screens/dashboard/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
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
import ApiClient from '../../services/ApiClient';
import colors from '../../utils/colors';
import { SiteShort } from '../../models/site'; // Adjust the import path as necessary

const DashboardScreen: React.FC = () => {
  const [recommendedSites, setRecommendedSites] = useState<SiteShort[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recommended surf sites
  const fetchRecommendedSites = async () => {
    try {
      setError(null);
      const response = await ApiClient.get<SiteShort[]>('/sites/recommended');
      setRecommendedSites(response.data);
    } catch (err) {
      console.error('Error fetching recommended sites:', err);
      setError('Unable to load recommendations. Please try again.');

      // For demo purposes, use sample data if API fails
      setRecommendedSites([
        {
          site_id: 1,
          site_name: 'La Jolla Shores',
          site_name_short: 'La Jolla',
        },
        { site_id: 2, site_name: "Black's Beach", site_name_short: "Black's" },
        { site_id: 3, site_name: "Swami's Beach", site_name_short: "Swami's" },
        { site_id: 4, site_name: 'Cardiff Reef', site_name_short: 'Cardiff' },
      ]);
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

  // Helper function to get crowd indicator color
  const getCrowdColor = (level: number): string => {
    if (level < 4) return colors.green;
    if (level < 7) return colors.lime;
    if (level < 9) return colors.yellow;
    return colors.orange;
  };

  // Helper function to render crowd level text
  const getCrowdText = (level: number): string => {
    if (level < 4) return 'Low';
    if (level < 7) return 'Moderate';
    if (level < 9) return 'Busy';
    return 'Crowded';
  };

  // Render individual site card
  const renderSiteCard = ({ item }: { item: SiteShort }) => {
    // For demo, generate random crowd level between 1-10
    const crowdLevel = Math.floor(Math.random() * 10) + 1;

    return (
      <TouchableOpacity style={styles.siteCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.siteName}>{item.site_name}</Text>
            <View
              style={[
                styles.crowdIndicator,
                { backgroundColor: getCrowdColor(crowdLevel) },
              ]}
            >
              <Text style={styles.crowdText}>{getCrowdText(crowdLevel)}</Text>
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
