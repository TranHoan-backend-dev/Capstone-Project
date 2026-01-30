import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './meterRoute.styles';

export default function MeterRouteHeader() {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction color="#fff" onPress = {() => navigation.goBack()} />
      <Appbar.Content
        title="Tuyến ghi chỉ số"
        titleStyle={styles.headerTitle}
      />
    </Appbar.Header>
  );
}
