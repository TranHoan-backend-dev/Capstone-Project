import React from 'react';
import { View, Modal, StyleSheet, Pressable, FlatList } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ThreeMonthData {
  month: string;
  index: number;
  m3: number;
  amount: string;
}

interface ThreeMonthsModalProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_DATA: ThreeMonthData[] = [
  { month: '12/2025', index: 584, m3: 4, amount: '39.560' },
  { month: '11/2025', index: 580, m3: 4, amount: '39.560' },
  { month: '10/2025', index: 576, m3: 4, amount: '39.560' },
];

const TableRow = ({ item }: { item: ThreeMonthData }) => (
  <View style={styles.tableRow}>
    <Text style={[styles.cell, styles.flex12]}>{item.month}</Text>
    <Text style={[styles.cell, styles.flex1]}>{item.index}</Text>
    <Text style={[styles.cell, styles.flex08]}>{item.m3}</Text>
    <Text style={[styles.cell, styles.flex12]}>{item.amount}</Text>
  </View>
);

export default function ThreeMonthsModal({
  visible,
  onClose,
}: ThreeMonthsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <Icon name="image" size={24} color="#757575" style={styles.headerIcon} />
              <Text style={styles.modalTitle}>3 tháng liền kề</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={20} color="#EF4444" />
            </Pressable>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.flex12]}>Kỳ</Text>
              <Text style={[styles.headerCell, styles.flex1]}>Chỉ số</Text>
              <Text style={[styles.headerCell, styles.flex08]}>M3</Text>
              <Text style={[styles.headerCell, styles.flex12]}>Số tiền</Text>
            </View>
            <Divider />
            <FlatList
              data={MOCK_DATA}
              renderItem={({ item }) => <TableRow item={item} />}
              keyExtractor={item => item.month}
              ItemSeparatorComponent={Divider}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  cell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  flex12: {
    flex: 1.2,
  },
  flex1: {
    flex: 1,
  },
  flex08: {
    flex: 0.8,
  },
});
