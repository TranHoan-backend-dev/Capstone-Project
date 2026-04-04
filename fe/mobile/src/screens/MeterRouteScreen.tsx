import React, { useState } from 'react';
import { View } from 'react-native';
import MeterRouteFilter from '../components/layout/meter-route/MeterRouteFilter';
import MeterRouteList from '../components/layout/meter-route/MeterRouteList';
import MeterRouteFooter from '../components/layout/meter-route/MeterRouteFooter';
import styles from '../components/layout/meter-route/meterRoute.styles';
import MeterRouteHeader from '../components/layout/meter-route/MeterRouteHeader';

export default function MeterRouteScreen() {
  const [period, setPeriod] = useState({
    ky: '12',
    nam: '2025',
    dot: '02',
  });

  return (
    <View style={styles.container}>
      <MeterRouteHeader />
      <MeterRouteFilter period={period} onChange={setPeriod} />
      <MeterRouteList period={period} />
      <MeterRouteFooter />
    </View>
  );
}
