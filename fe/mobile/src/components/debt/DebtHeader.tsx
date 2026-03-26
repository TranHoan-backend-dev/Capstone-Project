import React from 'react';
import { Appbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './debt.styles';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Props {
  title?: string;
  navigation?: NativeStackNavigationProp<RootStackParamList>;
  onBack?: () => void;
}

export default function DebtHeader({ title = 'Công nợ', navigation, onBack }: Props) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={handleBack} color="#333" />
      <Appbar.Content title={title} titleStyle={styles.headerTitle} />
      <View style={{ alignItems: 'center' }}>
        <Appbar.Action icon="bell-outline" color="#333" />
        <Text style={{ fontSize: 10, color: '#666', marginTop: -15 }}>Thông báo</Text>
      </View>
    </Appbar.Header>
  );
}
