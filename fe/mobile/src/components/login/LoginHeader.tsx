import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './login.styles';

export default function LoginHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.imageLogo}
      />
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>Công ty Cổ Phần Cấp Nước Nam Định</Text>
    </View>
  );
}
