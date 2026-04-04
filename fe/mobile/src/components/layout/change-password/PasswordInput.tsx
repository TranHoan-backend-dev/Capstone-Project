import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from './styles';

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function PasswordInput({
  placeholder,
  value,
  onChangeText,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        style={styles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        right={
          <TextInput.Icon
            icon={visible ? 'eye-off-outline' : 'eye-outline'}
            onPress={() => setVisible(!visible)}
          />
        }
      />
    </View>
  );
}
