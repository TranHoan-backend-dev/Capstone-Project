import React, { useState } from 'react';
import { View, Modal, FlatList, Pressable, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StatusOption {
  label: string;
  value: string;
}

interface StatusDropdownProps {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
}

const DropdownItem = ({ 
  item, 
  selectedValue, 
  onSelect 
}: { 
  item: StatusOption, 
  selectedValue: string, 
  onSelect: (val: string) => void 
}) => (
  <Pressable
    style={styles.dropdownItem}
    onPress={() => onSelect(item.value)}
  >
    <Text style={styles.dropdownItemText}>{item.label}</Text>
    {selectedValue === item.value && (
      <Icon name="check" size={20} color="#333" />
    )}
  </Pressable>
);

export default function StatusDropdown({
  value,
  options,
  onChange,
}: StatusDropdownProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Bình thường';

  const handleSelect = (val: string) => {
    onChange(val);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.statusMenuButton, visible && styles.activeButton]}
      >
        <Text style={styles.statusMenuText}>{selectedLabel}</Text>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#333"
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
                <DropdownItem 
                  item={item} 
                  selectedValue={value} 
                  onSelect={handleSelect} 
                />
              )}
              keyExtractor={item => item.value}
              ItemSeparatorComponent={Divider}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  statusMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  activeButton: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  statusMenuText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '35%', // Approx positioning, might need adjustment based on screen
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
});
