import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import MenuItemCard from '../../components/common/MenuItemCard';
import styles from './home.styles';

export default function HomeMenuGrid() {
  const navigation = useNavigation<any>();

  return (
    <>
      <Text style={styles.sectionTitle}>Các chức năng</Text>

      <View style={styles.grid}>
        <MenuItemCard
          icon="file-document-outline"
          label="Ghi chỉ số"
          onPress={() => navigation.navigate('Meter')}
        />

        <MenuItemCard
          icon="cash-multiple"
          label="Công nợ"
          onPress={() => navigation.navigate('Debt')}
        />

        <MenuItemCard
          icon="shield-check-outline"
          label="Báo sự cố"
        />

        <MenuItemCard
          icon="water-off-outline"
          label="Nghi rò rỉ"
        />

        <MenuItemCard
          icon="bell-outline"
          label="Gửi thông báo"
        />
      </View>
    </>
  );
}
