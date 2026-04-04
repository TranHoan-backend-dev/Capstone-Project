import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  icon: string;
  label: string;
  color?: string;
  onPress?: () => void;
}

const MenuItemCard = ({
  icon,
  label,
  color = '#2563EB',
  onPress,
}: Props) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={32} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default MenuItemCard;

const styles = StyleSheet.create({
  card: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
  },
});
