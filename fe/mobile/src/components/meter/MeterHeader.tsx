import React from 'react';
import { Appbar, Text } from 'react-native-paper';
import styles from './meter.styles';
import { useNavigation } from '@react-navigation/native';

export default function MeterHeader() {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress = {() => navigation.goBack()} />

      <Appbar.Content title="Ghi chỉ số" />

      <Appbar.Action icon="bell-outline" />
    </Appbar.Header>
  );
}
