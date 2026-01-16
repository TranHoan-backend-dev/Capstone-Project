import React, { useState } from 'react';
import { View } from 'react-native';
import FormInput from '../common/FormInput';
import LoginFooter from './LoginFooter';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login with:', email, password);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  return (
    <View>
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="example@email.com"
        keyboardType="email-address"
      />

      <FormInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <LoginFooter
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
      />
    </View>
  );
}
