import React, { useRef } from 'react';
import { View, Animated } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import styles from './styles';

type PaperTextInput = React.ComponentRef<typeof TextInput>;

export default function StepOTP({
  email,
  otp,
  setOtp,
  onNext,
  fadeAnim,
  slideAnim,
}: {
  email: string;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}) {
  const refs = useRef<PaperTextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text style={styles.title}>Xác thực OTP</Text>
      <Text>{email}</Text>

      <View style={styles.otpContainer}>
        {otp.map((d, i) => (
          <TextInput
            key={i}
            ref={(r: PaperTextInput | null) => {
              if (r) refs.current[i] = r;
            }}
            value={d}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={t => handleChange(t, i)}
            style={styles.otpInput}
          />
        ))}
      </View>

      <Button
        mode="contained"
        onPress={onNext}
        disabled={otp.join('').length !== 6}
      >
        Xác nhận
      </Button>
    </Animated.View>
  );
}
