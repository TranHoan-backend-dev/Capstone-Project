import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function LoginHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.imageLogo}
      />
      <Text variant="titleLarge">Đăng nhập</Text>
      <Text variant="bodyMedium">
        Công ty Cổ Phần Cấp Nước Nam Định
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageLogo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 12,
  },
});
