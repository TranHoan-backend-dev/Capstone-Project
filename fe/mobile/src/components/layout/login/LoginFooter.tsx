import React from 'react';
import { Button } from 'react-native-paper';

interface LoginFooterProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  loading?: boolean;
}

export default function LoginFooter({
  onLogin,
  onForgotPassword,
  loading,
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
        loading={loading}
        disabled={loading}
      >
        Đăng nhập
      </Button>
    </>
  );
}
