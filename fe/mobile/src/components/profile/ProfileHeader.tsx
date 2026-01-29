import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import styles from './styles';
import { useNavigation } from '@react-navigation/core';

export default function ProfileHeader() {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <IconButton icon="arrow-left" size={20} iconColor="#2563EB" />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
