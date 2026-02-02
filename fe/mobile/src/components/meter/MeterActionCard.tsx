import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meter.styles';
import { useNavigation } from '@react-navigation/native';
import MenuItemCard from '../common/MenuItemCard';

export default function MeterActionCard() {
  const navigation = useNavigation<any>();
  return (
    <View>
      <Text style={styles.sectionTitle}>Các chức năng</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log('Nhập chỉ số')}
        activeOpacity={0.8}
      >
        <MenuItemCard
          icon="cash-multiple"
          label="Nhập chỉ số"
          onPress={() => navigation.navigate('MeterRoute')}
        />
      </TouchableOpacity>
    </View>
  );
}
