import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
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
  color = '#1E88E5',
  onPress,
}: Props) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Card>
  );
};

export default MenuItemCard;

const styles = StyleSheet.create({
  card: {
    width: '30%',
    margin: '1.66%',
    borderRadius: 10,
    elevation: 2,
  },
  content: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});
