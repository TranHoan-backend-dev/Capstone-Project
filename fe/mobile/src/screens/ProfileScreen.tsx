import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Animated, StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../components/profile/styles';
import authService from '../services/auth.service';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileActions from '../components/profile/ProfileActions';

export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    };
    fetchUser();
  }, [fadeAnim]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const profileData = {
    name: user?.fullName || 'N/A',
    employeeId: user?.id || 'N/A',
    address: user?.address || 'N/A',
    status: 'Đang hoạt động', // Có thể cập nhật từ role hoặc field khác nếu có
    role: user?.role || 'N/A',
    phoneNumber: user?.phoneNumber || 'N/A',
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
