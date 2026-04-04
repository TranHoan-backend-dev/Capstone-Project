import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, Text, Divider, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThreeMonthsModal from './ThreeMonthsModal';
import StatusDropdown from './StatusDropdown';
import styles from './meterInput.styles';

interface MeterInputStatusCardProps {
  value?: string;
  onStatusChange?: (value: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'Bình thường', value: 'binh-thuong' },
  { label: 'Vòng', value: 'vong' },
  { label: 'Thay đồng hồ', value: 'thay-dong-ho' },
  { label: 'Không lưu được chỉ số', value: 'khong-luu-chi-so' },
  { label: 'Cất nước', value: 'cat-nuoc' },
];

export default function MeterInputStatusCard({
  value = 'binh-thuong',
  onStatusChange,
}: MeterInputStatusCardProps) {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const [showThreeMonthsModal, setShowThreeMonthsModal] = useState(false);

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    onStatusChange?.(val);
  };

  return (
    <>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.threeMonthsButtonRow}>
            <View style={styles.sectionHeader}>
              <Icon name="gauge" size={20} color="#1E88E5" style={styles.sectionIcon} />
              <Text style={styles.cardTitle}>Trạng thái đồng hồ</Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => setShowThreeMonthsModal(true)}
              style={styles.threeMonthsButton}
              labelStyle={styles.threeMonthsButtonLabel}
            >
              <Icon name="calendar-clock" size={16} color="#1E88E5" /> 3 tháng
            </Button>
          </View>


          <Divider style={styles.divider} />

          <View style={styles.dropdownContainer}>
            <StatusDropdown
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={handleStatusChange}
            />
          </View>
        </Card.Content>
      </Card>

      <ThreeMonthsModal
        visible={showThreeMonthsModal}
        onClose={() => setShowThreeMonthsModal(false)}
      />
    </>
  );
}
