import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'react-native';

import ProgressBar from '../components/forgot-password/ProgressBar';
import StepEmail from '../components/forgot-password/StepEmail';
import StepOTP from '../components/forgot-password/StepOTP';
import StepResetPassword from '../components/forgot-password/StepResetPassword';
import styles from '../components/forgot-password/styles';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFF" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProgressBar step={step} />

          {step === 1 && (
            <StepEmail
              email={email}
              setEmail={setEmail}
              onNext={() => setStep(2)}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          )}

          {step === 2 && (
            <StepOTP
              email={email}
              otp={otp}
              setOtp={setOtp}
              onNext={() => setStep(3)}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          )}

          {step === 3 && (
            <StepResetPassword
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
