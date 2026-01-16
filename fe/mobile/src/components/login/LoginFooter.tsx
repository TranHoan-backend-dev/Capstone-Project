import React from 'react';
import { Button } from 'react-native-paper';

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
      <Button
        mode="text"
        onPress={onForgotPassword}
      >
        Quên mật khẩu?
      </Button>

      <Button
        mode="contained"
        onPress={onLogin}
        style={{ marginTop: 8 }}
      >
        Đăng nhập
      </Button>
    </>
  );
}
