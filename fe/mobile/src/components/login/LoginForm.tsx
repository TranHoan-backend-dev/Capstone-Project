import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import FormInput from '../common/FormInput';
import LoginFooter from './LoginFooter';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginForm() {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(username, password);
    navigation.replace('Home');
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
      />
    </View>
  );
}
