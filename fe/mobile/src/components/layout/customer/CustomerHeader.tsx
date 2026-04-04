import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './customer.styles';

export default function CustomerHeader() {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
      <Appbar.Content
        title="Danh sách khách hàng"
        titleStyle={styles.headerTitle}
      />
    </Appbar.Header>
  );
}
