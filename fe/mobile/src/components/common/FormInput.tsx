import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function FormInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
}: FormInputProps) {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined"
      style={styles.input}
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
});
