import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './debt.styles';
import MenuItemCard from '../common/MenuItemCard';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DebtFunctionsGrid() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View>
      <View style={styles.grid}>
        <MenuItemCard
          icon="currency-usd"
          label="Thu tiền"
          onPress={() => navigation.navigate('Collection')}
        />
        <MenuItemCard
          icon="chart-bar"
          label="Thống kê"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
