import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './styles';
import RequirementItem from './RequirementItem';

type Props = {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

export default function PasswordRequirements(props: Props) {
  return (
    <View style={styles.requirementsBox}>
      <Text style={styles.requirementsTitle}>
        Yêu cầu mật khẩu mới:
      </Text>

      <RequirementItem text="Ít nhất 8 ký tự" isValid={props.hasMinLength} />
      <RequirementItem text="Có ít nhất 1 chữ hoa" isValid={props.hasUpperCase} />
      <RequirementItem text="Có ít nhất 1 số" isValid={props.hasNumber} />
      <RequirementItem
        text="Có ít nhất 1 ký tự đặc biệt"
        isValid={props.hasSpecialChar}
        recommended
      />
    </View>
  );
}
