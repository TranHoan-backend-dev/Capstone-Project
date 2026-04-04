import React, { useState, useEffect } from 'react';
import { ScrollView, Text, ActivityIndicator, View } from 'react-native';
import MeterRouteCard from './MeterRouteCard';
import styles from './meterRoute.styles';
import { roadmapService, MeterRoute } from '../../../services/roadmapService';

// const MOCK_DATA: MeterRoute[] = [
//   {
//     id: '5e6f7081-4000-4eee-9fff-eeeeeeee0001',
//     name: 'Tuyến số 1 (Hoàn Kiếm)',
//     type: '93Vc',
//     totalCustomer: 424,
//     recorded: 424,
//     unrecorded: 0,
//     cutWater: 0,
//     m3: '4.006',
//     totalAmount: '43.405.485',
//   },
//   {
//     id: '01C223',
//     name: 'Tuyến phố Huế',
//     type: '115.1',
//     totalCustomer: 429,
//     recorded: 428,
//     unrecorded: 1,
//     cutWater: 0,
//     m3: '4.374',
//     totalAmount: '43.764.735',
//   },
//   {
//     id: '01C452',
//     name: 'Tuyến Trường Chinh',
//     type: '97s',
//     totalCustomer: 1703,
//     recorded: 1702,
//     unrecorded: 1,
//     cutWater: 0,
//     m3: '17.842',
//     totalAmount: '191.314.690',
//   },
// ];

export default function MeterRouteList({ period }: { period: any }) {
  const [routes, setRoutes] = useState<MeterRoute[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { cacheService } = require('../../services/cacheService');
      const cacheKey = `routes:${period.ky}:${period.nam}:${period.dot}`;

      // 1. Dùng cache để hiển thị ngay lập tức
      const cached = cacheService.get(cacheKey);
      if (cached) {
        setRoutes(cached);
      } else {
        setLoading(true);
      }

      try {
        const res = await roadmapService.getMyRoadmaps(period.ky, period.nam, period.dot);
        if (res) {
          setRoutes(res);
          cacheService.set(cacheKey, res);
        }
      } catch (err) {
        console.error('Failed to fetch routes, using mock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [period.ky, period.nam, period.dot]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <>
      <Text style={styles.sectionTitle}>Danh sách tuyến ghi</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {routes.map(item => (
          <MeterRouteCard key={item.id} data={item} />
        ))}
        {routes.length === 0 && (
          <Text style={styles.emptyText}>
            Không có tuyến ghi nào khả dụng
          </Text>
        )}
      </ScrollView>
    </>
  );
}
