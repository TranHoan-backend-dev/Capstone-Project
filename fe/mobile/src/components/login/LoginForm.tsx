import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import FormInput from '../common/FormInput';
import LoginFooter from './LoginFooter';
import authService from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginForm() {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validate data
    const validationError = authService.validateCredentials(identifier, password);
    if (validationError) {
      showToast.error(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // 2. Sending request to backend
      console.log("[LoginForm] send credentials to login")
      await login(identifier, password);
      console.log("[LoginForm] finish logging in")

      // 3. Receive response & Store token (handled inside service through context)
      showToast.success('Đăng nhập thành công');
    } catch (error: any) {
      console.error('Login error:', error);
      // apiFetch đã hiển thị toast rồi
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <FormInput
        label="Email hoặc Tên đăng nhập"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />

      <FormInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <LoginFooter
        onLogin={handleLogin}
        onForgotPassword={() => navigation.navigate('ForgotPassword')}
        loading={isLoading}
      />
    </View>
  );
}
