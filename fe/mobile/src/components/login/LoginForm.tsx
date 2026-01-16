import React, { useState } from 'react';
import { View } from 'react-native';
import FormInput from '../common/FormInput';
import LoginFooter from './LoginFooter';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <FormInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <LoginFooter
        onLogin={() => console.log(email, password)}
        onForgotPassword={() => console.log('forgot')}
      />
    </View>
  );
}
