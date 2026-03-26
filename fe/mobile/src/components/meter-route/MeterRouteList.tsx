import React from 'react';
import { ScrollView, Text } from 'react-native';
import MeterRouteCard from './MeterRouteCard';
import styles from './meterRoute.styles';

const MOCK_DATA = [
  {
    id: '01C137',
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
  const [routes] = React.useState(MOCK_DATA);
  // const [loading, setLoading] = React.useState(false);

  /* Code mẫu gọi API từ backend (Để trong comment để dùng khi backend sẵn sàng)
  React.useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        // Giả sử lấy dữ liệu cho kỳ hiện tại
        // const res = await roadmapService.getMyRoadmaps('12', '2025', '02');
        // if (res && res.length > 0) setRoutes(res);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
      } finally {
        setLoading(false);
      }
    };
    // fetchRoutes();
  }, []);
  */

  return (
    <>
      <Text style={styles.sectionTitle}>Danh sách tuyến ghi</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {routes.map(item => (
          <MeterRouteCard key={item.id} data={item} />
        ))}
      </ScrollView>
    </>
  );
}
