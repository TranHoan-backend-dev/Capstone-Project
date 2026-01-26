import React from 'react';
import { Appbar, Avatar, Text } from 'react-native-paper';
import styles from './home.styles';

export default function HomeHeader() {
  return (
    <Appbar.Header style={styles.header}>
      <Avatar.Image
        size={40}
        source={require('../../assets/logo.png')}
      />
      <Text style={styles.userName}>Nguyễn Dũng</Text>
      <Appbar.Action icon="bell-outline" color="#fff" />
    </Appbar.Header>
  );
}
