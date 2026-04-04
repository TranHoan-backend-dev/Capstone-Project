import React, { useState } from 'react';
import { View, Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import { Appbar, Text, Switch, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MeterInputHeaderProps {
  onBack: () => void;
}

const MENU_OPTIONS = [
  { id: 1, icon: 'map-marker-outline', label: 'Cập nhật địa chỉ', hasSwitch: false },
  { id: 2, icon: 'cellphone', label: 'Cập nhật số điện thoại', hasSwitch: false },
  { id: 3, icon: 'account-group-outline', label: 'Cập nhật số hộ, số khẩu', hasSwitch: false },
  { id: 4, icon: 'note-edit-outline', label: 'Cập nhật ghi chú', hasSwitch: false },
  { id: 5, icon: 'target', label: 'Lấy toạ độ vị trí đồng hồ', hasSwitch: false },
  { id: 6, icon: 'directions', label: 'Chỉ đường đến vị trí đồng hồ', hasSwitch: false },
  { id: 7, icon: 'microphone-outline', label: 'Ghi chỉ số bằng giọng nói', hasSwitch: true },
  { id: 8, icon: 'qrcode-scan', label: 'Quét mã vạch', hasSwitch: false },
];

const MenuItem = ({ 
  item, 
  voiceInputEnabled, 
  setVoiceInputEnabled 
}: { 
  item: typeof MENU_OPTIONS[0],
  voiceInputEnabled: boolean,
  setVoiceInputEnabled: (val: boolean) => void
}) => (
  <Pressable style={styles.menuOptionItem}>
    <View style={styles.menuOptionContent}>
      <View style={styles.iconWrapper}>
        <Icon name={item.icon} size={22} color="#1E88E5" />
      </View>
      <Text style={styles.menuOptionText}>{item.label}</Text>
    </View>
    {item.hasSwitch ? (
      <Switch
        value={voiceInputEnabled}
        onValueChange={setVoiceInputEnabled}
        color="#1E88E5"
      />
    ) : (
      <Icon name="chevron-right" size={24} color="#E0E0E0" />
    )}
  </Pressable>
);

export default function MeterInputHeader({ onBack }: MeterInputHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(false);

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={onBack} color="#333" />
        <Appbar.Content title="Ghi chỉ số" titleStyle={styles.headerTitle} />
        <Appbar.Action
          icon="menu"
          color="#333"
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
              <View style={styles.menuHeaderLeft}>
                <Icon name="menu" size={24} color="#757575" style={styles.menuHeaderIcon} />
                <Text style={styles.menuModalTitle}>Chức năng</Text>
              </View>
              <Pressable onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={20} color="#EF4444" />
              </Pressable>
            </View>
            <Divider />

            <FlatList
              data={MENU_OPTIONS}
              renderItem={({ item }) => (
                <MenuItem 
                  item={item} 
                  voiceInputEnabled={voiceInputEnabled} 
                  setVoiceInputEnabled={setVoiceInputEnabled} 
                />
              )}
              keyExtractor={item => item.id.toString()}
              ItemSeparatorComponent={Divider}
              contentContainerStyle={styles.menuListContent}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  menuModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuHeaderIcon: {
    marginRight: 12,
  },
  menuModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuOptionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  menuListContent: {
    paddingBottom: 16,
  },
});
