import React from 'react';
import { Appbar } from 'react-native-paper';
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
      <Appbar.BackAction onPress={handleBack} color="#fff" />
      <Appbar.Content title={title} titleStyle={styles.headerTitle} />
      <Appbar.Action icon="bell-outline" color="#fff" />
    </Appbar.Header>
  );
}
