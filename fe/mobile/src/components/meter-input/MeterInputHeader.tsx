import React, { useState } from 'react';
import { View, Modal, Pressable, FlatList } from 'react-native';
import { Appbar, Text, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface MeterInputHeaderProps {
  onBack: () => void;
}

const MENU_OPTIONS = [
  { id: 1, icon: 'sync', label: 'Cắp nhất dữ liệu chỉ', hasSwitch: false },
  { id: 2, icon: 'phone', label: 'Cắp nhất số điện thoại', hasSwitch: false },
  { id: 3, icon: 'account-multiple', label: 'Cắp nhất số hộ, số nhân khẩu', hasSwitch: false },
  { id: 4, icon: 'pencil', label: 'Cắp nhất ghi chú chủ', hasSwitch: false },
  { id: 5, icon: 'map-marker', label: 'Lấy toa độ vi trí đồng hồ', hasSwitch: false },
  { id: 6, icon: 'map', label: 'Chi dường diện vi trị đồng hộ', hasSwitch: false },
  { id: 7, icon: 'microphone', label: 'Ghi chỉ số bằng giong nói', hasSwitch: true },
  { id: 8, icon: 'barcode', label: 'Quyết mã vạch', hasSwitch: false },
];

export default function MeterInputHeader({ onBack }: MeterInputHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [switchStates, setSwitchStates] = useState<Record<number, boolean>>({});

  const handleSwitchToggle = (id: number) => {
    setSwitchStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderMenuItem = ({ item }: { item: typeof MENU_OPTIONS[0] }) => (
    <Pressable style={styles.menuOptionItem}>
      <View style={styles.menuOptionContent}>
        <Icon name={item.icon} size={20} color="#1E88E5" />
        <Text style={styles.menuOptionText}>{item.label}</Text>
      </View>
      {item.hasSwitch && (
        <Switch
          value={switchStates[item.id] || false}
          onValueChange={() => handleSwitchToggle(item.id)}
        />
      )}
      {!item.hasSwitch && (
        <Icon name="chevron-right" size={20} color="#ccc" />
      )}
    </Pressable>
  );

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={onBack} color="#fff" />
        <Appbar.Content title="Ghi chỉ số" titleStyle={styles.headerTitle} />
        <Appbar.Action
          icon="menu"
          color="#fff"
          onPress={() => setMenuVisible(true)}
        />
      </Appbar.Header>

      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuModalContent}>
            <View style={styles.menuModalHeader}>
              <Text style={styles.menuModalTitle}>Chức năng</Text>
              <Pressable onPress={() => setMenuVisible(false)}>
                <Icon name="close" size={24} color="#E53935" />
              </Pressable>
            </View>

            <FlatList
              data={MENU_OPTIONS}
              renderItem={renderMenuItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
