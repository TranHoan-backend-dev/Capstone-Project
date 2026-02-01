import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './styles';

type Props = {
  text: string;
  isValid: boolean;
  recommended?: boolean;
};

export default function RequirementItem({
  text,
  isValid,
  recommended,
}: Props) {
  return (
    <View style={styles.requirement}>
      <View
        style={[
          styles.bullet,
          isValid ? styles.bulletActive : styles.bulletInactive,
        ]}
      />
      <Text
        style={[
          styles.requirementText,
          isValid && styles.requirementTextActive,
        ]}
      >
        {text}
        {recommended && <Text style={styles.recommended}> (khuyến khích)</Text>}
      </Text>
    </View>
  );
}
