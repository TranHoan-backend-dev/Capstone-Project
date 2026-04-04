import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface FormInputProps extends Omit<TextInputProps, 'theme'> {
  label: string;
}

export default function FormInput({
  label,
  ...props
}: FormInputProps) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      style={styles.input}
      autoCapitalize="none"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
});
