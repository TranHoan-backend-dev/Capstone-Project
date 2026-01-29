import React, { useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MeterInputForm from '../components/meter-input/MeterInputForm';
import MeterInputHeader from '../components/meter-input/MeterInputHeader';
import styles from '../components/meter-input/meterInput.styles';

const MeterInputScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { customerId, customerName, address } = route.params || {};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      <MeterInputHeader onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <MeterInputForm 
          customerId={customerId} 
          customerName={customerName}
          address={address}
        />
      </ScrollView>
    </View>
  );
};

export default MeterInputScreen;
