import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';
import common from './common.styles';

interface CardContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function CardContainer({
  children,
  style,
}: CardContainerProps) {
  return (
    <Card style={[common.card, style]}>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}
