import React, { useEffect, useRef } from 'react';
import { ScrollView, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../components/profile/styles';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileActions from '../components/profile/ProfileActions';

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const profileData = {
    name: 'Nguyễn Thị Minh Hạnh',
    customerId: 'KH-2024-001234',
    address: '123 Đường Lê Lợi, Phường 1, Quận 1, TP. HCM',
    status: 'Đang hoạt động',
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ProfileHeader />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <ProfileCard data={profileData} />
            <ProfileActions />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
