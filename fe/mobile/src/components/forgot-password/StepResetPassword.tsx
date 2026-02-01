import React, { useState } from 'react';
import { Animated } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import styles from './styles';

export default function StepResetPassword({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  fadeAnim,
  slideAnim,
}: any) {
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text style={styles.title}>Đặt mật khẩu mới</Text>

      <TextInput
        label="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        label="Nhập lại mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <Button
        mode="contained"
        disabled={!hasMinLength || !hasUpperCase || !hasNumber}
      >
        Đặt lại mật khẩu
      </Button>
    </Animated.View>
  );
}
