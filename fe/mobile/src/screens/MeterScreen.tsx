import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../components/layout/meter/meter.styles';

import MeterHeader from '../components/layout/meter/MeterHeader';
import MeterActionCard from '../components/layout/meter/MeterActionCard';

export default function MeterScreen() {
  return (
    <View style={styles.container}>
      <MeterHeader />

      <ScrollView contentContainerStyle={styles.content}>
        <MeterActionCard />
      </ScrollView>
    </View>
  );
}
