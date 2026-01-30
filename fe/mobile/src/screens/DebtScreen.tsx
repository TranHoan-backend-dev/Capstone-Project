import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import DebtHeader from '../components/debt/DebtHeader';
import DebtFunctionsGrid from '../components/debt/DebtFunctionsGrid';
import styles from '../components/debt/debt.styles';

export default function DebtScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <DebtHeader onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Các chức năng</Text>
        <DebtFunctionsGrid />
      </ScrollView>
    </View>
  );
}
