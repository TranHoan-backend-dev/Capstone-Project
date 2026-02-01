import React, { useState } from 'react';
import { View } from 'react-native';
import MeterRouteFilter from '../components/meter-route/MeterRouteFilter';
import MeterRouteList from '../components/meter-route/MeterRouteList';
import MeterRouteFooter from '../components/meter-route/MeterRouteFooter';
import styles from '../components/meter-route/meterRoute.styles';
import MeterRouteHeader from '../components/meter-route/MeterRouteHeader';

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
      <MeterRouteList />
      <MeterRouteFooter />
    </View>
  );
}
