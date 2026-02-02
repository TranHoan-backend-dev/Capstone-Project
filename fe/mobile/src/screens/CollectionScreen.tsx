import React, { useState } from 'react';
import { View, FlatList, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DebtHeader from '../components/debt/DebtHeader';
import CollectionListItem from '../components/debt-route/CollectionListItem';
import styles from '../components/debt-route/debtRoute.styles';
import { RootStackParamList } from '../navigation/AppNavigator';

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

// Mock data matching the image
const MOCK_COLLECTIONS: CollectionItem[] = [
  {
    id: '01C137',
    meterId: '93Vc',
    soHD: '389',
    daZhu: '317',
    conLai: '72',
    tongTien: 43405485,
    tienThu: 33141505,
    tienConLai: 10263980,
    soHDTon: '3',
    daZhuThuTon: '0',
    tienThuThuTon: 0,
    tongTienTon: 280945,
    tienTonConLai: 280945,
  },
  {
    id: '01C223',
    meterId: '115.1',
    soHD: '389',
    daZhu: '216',
    conLai: '173',
    tongTien: 43764735,
    tienThu: 22938195,
    tienConLai: 20826540,
    soHDTon: '21',
    daZhuThuTon: '0',
    tienThuThuTon: 0,
    tongTienTon: 1783110,
    tienTonConLai: 1783110,
  },
];

type TabType = 'number' | 'customer';

export default function CollectionScreen({ navigation }: CollectionScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('number');
  const [filters, setFilters] = useState<CollectionFilterState>({
    period: '12',
    year: '2025',
    batch: '02',
  });

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
        <Text style={styles.sectionTitle}>Danh sách số thu</Text>

        {/* Collection List */}
        <FlatList
          data={MOCK_COLLECTIONS}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => <CollectionListItem item={item} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}
