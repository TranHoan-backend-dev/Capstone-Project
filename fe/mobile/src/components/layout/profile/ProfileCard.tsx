import React from 'react';
import { View } from 'react-native';
import { Surface, Text, Divider, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import ProfileInfoRow from './ProfileInfoRow';

type Props = {
  data: {
    name: string;
    address: string;
    employeeId: string;
    status: string;
    role: string;
    phoneNumber: string;
  };
};

const ROLE_MAP: Record<string, string> = {
  IT_STAFF: 'Nhân viên IT',
  PLANNING_TECHNICAL_DEPARTMENT_HEAD: 'Trưởng phòng Kế hoạch - Kỹ thuật',
  SURVEY_STAFF: 'Nhân viên khảo sát',
  ORDER_RECEIVING_STAFF: 'Nhân viên tiếp nhận hồ sơ',
  FINANCE_DEPARTMENT: 'Bộ phận Tài chính',
  CONSTRUCTION_DEPARTMENT_HEAD: 'Trưởng phòng Thi công',
  CONSTRUCTION_DEPARTMENT_STAFF: 'Nhân viên Thi công',
  BUSINESS_DEPARTMENT_HEAD: 'Trưởng phòng Kinh doanh',
  METER_INSPECTION_STAFF: 'Nhân viên Ghi chỉ số',
  COMPANY_LEADERSHIP: 'Lãnh đạo Công ty',
};

const translateRole = (role: string) => ROLE_MAP[role] || role;

const ChipIcon = () => (
  <Icon name="circle" size={10} color="#10B981" style={styles.statusIconInner} />
);

export default function ProfileCard({ data }: Props) {
  return (
    <Surface style={styles.card} elevation={1}>
      {/* Header Banner Section */}
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.cardTitle}>{data.name}</Text>
          <Text style={styles.roleText}>{translateRole(data.role)}</Text>
        </View>
        <Chip
          style={styles.statusChip}
          textStyle={styles.statusText}
          icon={ChipIcon}
          mode="flat"
        >
          {data.status}
        </Chip>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.profileContent}>
        <ProfileInfoRow
          leftLabel="ĐỊA CHỈ"
          leftValue={data.address}
          rightLabel="SỐ ĐIỆN THOẠI"
          rightValue={data.phoneNumber}
        />
      </View>
    </Surface>
  );
}
