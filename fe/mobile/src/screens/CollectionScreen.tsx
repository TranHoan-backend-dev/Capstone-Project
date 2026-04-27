import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DebtHeader from '../components/layout/debt/DebtHeader';
import CollectionListItem from '../components/layout/debt-route/CollectionListItem';
import styles from '../components/layout/debt-route/debtRoute.styles';
import { RootStackParamList } from '../navigation/AppNavigator';
import { roadmapService } from '../services/roadmapService';

type CollectionScreenProps = NativeStackScreenProps<RootStackParamList, 'Collection'>;

interface CollectionFilterState {
  period: string;
  year: string;
  batch: string;
}

interface CollectionItem {
  id: string;
  meterId: string;
  soHD: string;
  daZhu: string;
  conLai: string;
  tongTien: number;
  tienThu: number;
  tienConLai: number;
  soHDTon?: string;
  daZhuThuTon?: string;
  tienThuThuTon?: number;
  tongTienTon?: number;
  tienTonConLai?: number;
}

type TabType = 'number' | 'customer';

export default function CollectionScreen({ navigation }: CollectionScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('number');
  const [filters, setFilters] = useState<CollectionFilterState>({
    period: '12',
    year: '2025',
    batch: '02',
  });
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const data = await roadmapService.getMyRoadmaps(filters.period, filters.year, filters.batch);
        if (data) {
          const mapped: CollectionItem[] = data.map(route => {
            const total = parseFloat(route.totalAmount?.replace(/\./g, '').replace(',', '.')) || 0;
            return {
              id: route.id,
              meterId: route.name,
              soHD: String(route.totalCustomer),
              daZhu: String(route.recorded),
              conLai: String(route.unrecorded),
              tongTien: total,
              tienThu: 0, // Hiện tại MeterRoute chưa có trường tiền đã thu cụ thể
              tienConLai: total, // Tạm thời để bằng tổng tiền
              soHDTon: '0',
              daZhuThuTon: '0',
              tienThuThuTon: 0,
              tongTienTon: 0,
              tienTonConLai: 0,
            };
          });
          setCollections(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [filters.period, filters.year, filters.batch]);

  const handleFilterChange = (type: keyof CollectionFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  return (
    <View style={styles.container}>
      <DebtHeader title="Thu Tiền nước" navigation={navigation as any} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tab Section */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'number' && styles.tabButtonActive]}
            onPress={() => setActiveTab('number')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'number' && styles.tabButtonTextActive,
              ]}
            >
              Theo số
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'customer' && styles.tabButtonActive]}
            onPress={() => setActiveTab('customer')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'customer' && styles.tabButtonTextActive,
              ]}
            >
              Theo khách hàng
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Kỳ</Text>
            <Button
              mode="outlined"
              style={styles.filterButton}
              labelStyle={styles.filterButtonText}
              onPress={() => handleFilterChange('period', filters.period)}
            >
              {filters.period}
            </Button>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Năm</Text>
            <Button
              mode="outlined"
              style={styles.filterButton}
              labelStyle={styles.filterButtonText}
              onPress={() => handleFilterChange('year', filters.year)}
            >
              {filters.year}
            </Button>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Đợt</Text>
            <Button
              mode="outlined"
              style={styles.filterButton}
              labelStyle={styles.filterButtonText}
              onPress={() => handleFilterChange('batch', filters.batch)}
            >
              {filters.batch}
            </Button>
          </View>
        </View>

        {/* Collection List Title */}
        <Text style={styles.sectionTitle}>Danh sách sổ thu</Text>

        {/* Collection List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <FlatList
            data={collections}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => <CollectionListItem item={item} />}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Không có dữ liệu thu tiền
              </Text>
            }
          />
        )}
      </ScrollView>
    </View>
  );
}
