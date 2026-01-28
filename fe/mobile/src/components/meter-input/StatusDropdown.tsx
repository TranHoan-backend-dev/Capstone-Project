import React, { useState } from 'react';
import { View, Modal, FlatList, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface StatusOption {
  label: string;
  value: string;
}

interface StatusDropdownProps {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
}

export default function StatusDropdown({
  value,
  options,
  onChange,
}: StatusDropdownProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Bình thường';

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={styles.statusMenuButton}
      >
        <Text style={styles.statusMenuText}>{selectedLabel}</Text>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#1E88E5"
        />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.dropdownOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                  {value === item.value && (
                    <Icon name="check" size={20} color="#4CAF50" />
                  )}
                </Pressable>
              )}
              keyExtractor={item => item.value}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
