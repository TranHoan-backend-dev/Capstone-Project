import React from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import styles from './home.styles';

export default function HomeBottomTab() {
  return (
    <View style={styles.bottomTab}>
      <View style={styles.tabItemActive}>
        <IconButton icon="home" iconColor="#1E88E5" />
        <Text style={styles.activeText}>Trang chủ</Text>
      </View>

      <View style={styles.tabItem}>
        <IconButton icon="cog-outline" />
        <Text>Cài đặt</Text>
      </View>
    </View>
  );
}
