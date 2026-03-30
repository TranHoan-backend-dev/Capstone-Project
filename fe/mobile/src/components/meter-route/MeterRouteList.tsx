import React, { useState, useEffect } from 'react';
import { ScrollView, Text, ActivityIndicator, View } from 'react-native';
import MeterRouteCard from './MeterRouteCard';
import styles from './meterRoute.styles';
import { roadmapService, MeterRoute } from '../../services/roadmapService';

const MOCK_DATA: MeterRoute[] = [
  {
    id: '5e6f7081-4000-4eee-9fff-eeeeeeee0001',
    name: 'Tuyến số 1 (Hoàn Kiếm)',
    type: '93Vc',
    totalCustomer: 424,
    recorded: 424,
    unrecorded: 0,
    cutWater: 0,
    m3: '4.006',
    totalAmount: '43.405.485',
  },
  {
    id: '01C223',
    name: 'Tuyến phố Huế',
    type: '115.1',
    totalCustomer: 429,
    recorded: 428,
    unrecorded: 1,
    cutWater: 0,
    m3: '4.374',
    totalAmount: '43.764.735',
  },
  {
    id: '01C452',
    name: 'Tuyến Trường Chinh',
    type: '97s',
    totalCustomer: 1703,
    recorded: 1702,
    unrecorded: 1,
    cutWater: 0,
    m3: '17.842',
    totalAmount: '191.314.690',
  },
];

export default function MeterRouteList() {
  // Ưu tiên hiển thị mock data như yêu cầu
  const [routes, setRoutes] = useState<MeterRoute[]>(MOCK_DATA);
  const [loading, setLoading] = useState(false);

  /* logic binding dữ liệu thật (Commented out như yêu cầu)
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        // Gọi API thật từ service
        const res = await roadmapService.getMyRoadmaps('03', '2024', '01');
        if (res && res.length > 0) {
          // Khi backend sẵn sàng, dòng này sẽ ghi đè mock data
          setRoutes(res);
        }
      } catch (err) {
        console.error('Failed to fetch routes, using mock data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Kích hoạt khi backend thực sự sẵn sàng
    // fetchRoutes();
  }, []);
  */

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
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
          <Text style={{ padding: 20, textAlign: 'center', color: '#666' }}>
            Không tìm thấy tuyến ghi nào
          </Text>
        )}
      </ScrollView>
    </>
  );
}
