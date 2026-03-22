import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import FormInput from '../common/FormInput';
import LoginFooter from './LoginFooter';
import authService from '../../services/auth.service';
import { showToast } from '../../utils/toast';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginForm() {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      showToast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      await authService.login(username, password);
      showToast.success('Đăng nhập thành công');
      navigation.replace('Home');
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
        label="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
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
