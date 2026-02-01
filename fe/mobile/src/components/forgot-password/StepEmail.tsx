import React from 'react';
import { Animated } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import styles from './styles';

export default function StepEmail({
  email,
  setEmail,
  onNext,
  fadeAnim,
  slideAnim,
}: any) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text style={styles.title}>Quên mật khẩu?</Text>
      <Text style={styles.subtitle}>
        Nhập email để nhận mã OTP
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        mode="contained"
        style={styles.button}
        onPress={onNext}
        disabled={!email}
      >
        Gửi mã OTP
      </Button>
    </Animated.View>
  );
}
