import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import MenuItemCard from '../../ui/MenuItemCard';
import styles from './home.styles';

export default function HomeMenuGrid() {
  const navigation = useNavigation<any>();

  return (
    <>
      <Text style={styles.sectionTitle}>Các chức năng</Text>

      <View style={styles.grid}>
        <MenuItemCard
          icon="book-edit-outline"
          label="Ghi chỉ số"
          onPress={() => navigation.navigate('MeterRoute')}
        />

        <MenuItemCard
          icon="cash-check"
          label="Công nợ"
          onPress={() => navigation.navigate('Debt')}
        />

        <MenuItemCard
          icon="message-badge-outline"
          label="Gửi thông báo"
          onPress={() => navigation.navigate('Notification')}
        />

        <MenuItemCard
          icon="image-search-outline"
          label="Kiểm tra hình ảnh"
          onPress={() => navigation.navigate('ImageReview')}
        />
      </View>
    </>
  );
}
