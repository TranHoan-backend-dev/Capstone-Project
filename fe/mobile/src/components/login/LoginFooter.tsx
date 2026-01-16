import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './login.styles';

interface LoginFooterProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export default function LoginFooter({
  onLogin,
  onForgotPassword,
}: LoginFooterProps) {
  return (
    <>
      <TouchableOpacity
        onPress={onForgotPassword}
        style={styles.forgotButton}
      >
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={onLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.signInButtonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </>
  );
}
