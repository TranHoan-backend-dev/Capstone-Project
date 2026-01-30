import React from 'react';
import { View, Modal, FlatList } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import styles from './meterInput.styles';

interface ThreeMonthData {
  month: string;
  oldIndex: number;
  m3: number;
  amount: number;
}

interface ThreeMonthsModalProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_DATA: ThreeMonthData[] = [
  { month: '12/2025', oldIndex: 584, m3: 4, amount: 39.560 },
  { month: '11/2025', oldIndex: 580, m3: 4, amount: 39.560 },
  { month: '10/2025', oldIndex: 576, m3: 4, amount: 39.560 },
];

export default function ThreeMonthsModal({
  visible,
  onClose,
}: ThreeMonthsModalProps) {
  const renderMonthItem = ({ item }: { item: ThreeMonthData }) => (
    <>
      <View style={styles.monthRowContainer}>
        <View style={styles.monthColumn}>
          <Text style={styles.monthLabel}>Kỳ</Text>
          <Text style={styles.monthValue}>{item.month}</Text>
        </View>
        <View style={styles.monthColumn}>
          <Text style={styles.monthLabel}>Chỉ số</Text>
          <Text style={styles.monthValue}>{item.oldIndex}</Text>
        </View>
        <View style={styles.monthColumn}>
          <Text style={styles.monthLabel}>M3</Text>
          <Text style={styles.monthValue}>{item.m3}</Text>
        </View>
        <View style={styles.monthColumn}>
          <Text style={styles.monthLabel}>Số tiền</Text>
          <Text style={styles.monthValue}>{item.amount}</Text>
        </View>
      </View>
      <Divider style={styles.divider} />
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>3 tháng liền kề</Text>
            <Button mode="text" onPress={onClose} style={styles.modalCloseButton}>
              ✕
            </Button>
          </View>

          <Card style={styles.monthsCard}>
            <Card.Content>
              <FlatList
                data={MOCK_DATA}
                renderItem={renderMonthItem}
                keyExtractor={(item) => item.month}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>
        </View>
      </View>
    </Modal>
  );
}
