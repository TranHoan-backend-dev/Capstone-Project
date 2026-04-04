import React from 'react';
import { View, ViewStyle } from 'react-native';
import common from './common.styles';

interface StatsGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function StatsGrid({ children, style }: StatsGridProps) {
  return <View style={[common.statsGrid, style]}>{children}</View>;
}
