import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import common from './common.styles';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  backgroundColor?: string;
  onMenuPress?: () => void;
}

export default function AppHeader({
  title,
  showBackButton = true,
  showMenuButton = false,
  backgroundColor = '#1E88E5',
  onMenuPress,
}: AppHeaderProps) {
  const navigation = useNavigation();

  return (
    <Appbar.Header style={[common.header, { backgroundColor }]}>
      {showBackButton && (
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#fff"
        />
      )}
      <Appbar.Content
        title={title}
        titleStyle={common.headerTitle}
      />
      {showMenuButton && (
        <Appbar.Action
          icon="bell-outline"
          color="#fff"
          onPress={onMenuPress}
        />
      )}
    </Appbar.Header>
  );
}
