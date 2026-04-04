import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet } from 'react-native';
import HomeHeader from '../components/layout/home/HomeHeader';
import HomeMenuGrid from '../components/layout/home/HomeMenuGrid';
import HomeWatermark from '../components/layout/home/HomeWatermark';
import HomeBottomTab from '../components/layout/home/HomeBottomTab';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0288D1" barStyle="light-content" />

      <HomeHeader />

      <ScrollView>
        <HomeMenuGrid />
        <HomeWatermark />
      </ScrollView>

      <HomeBottomTab />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F7',
  },
});
