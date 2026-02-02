import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './customer.styles';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function CustomerFilter({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false);
  const options = ['Tất cả', 'Đã ghi', 'Chưa ghi'];

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>
        Tình trạng
      </Text>

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable
            onPress={() => setVisible(true)}
            style={styles.filterButtonMenu}
          >
            <Text style={styles.filterButtonText}>{value}</Text>
            <Icon
              name={visible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#1E88E5"
            />
          </Pressable>
        }
      >
        {options.map(item => (
          <Menu.Item
            key={item}
            onPress={() => {
              onChange(item);
              setVisible(false);
            }}
            title={
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>{item}</Text>
                {value === item && (
                  <Icon name="check" size={18} color="#4CAF50" />
                )}
              </View>
            }
            style={styles.menuItem}
          />
        ))}
      </Menu>
    </View>
  );
}
