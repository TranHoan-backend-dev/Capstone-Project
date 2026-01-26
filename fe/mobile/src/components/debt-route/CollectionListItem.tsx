import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcon from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import styles from './debtRoute.styles';
import { useNavigation } from '@react-navigation/native';

interface CollectionItem {
  id: string;
  meterId: string;
  soHD: string;
  daZhu: string;
  conLai: string;
  tongTien: number;
  tienThu: number;
  tienConLai: number;
  // Detailed data
  soHDTon?: string;
  daZhuTon?: string;
  tienThuTon?: string;
  tongTienTon?: number;
  daZhuThuTon?: string;
  tienThuThuTon?: number;
  tienTonConLai?: number;
}

interface CollectionListItemProps {
  item: CollectionItem;
}

const formatNumber = (num: number | string) => {
  if (typeof num === 'string') return num;
  return num.toLocaleString('vi-VN');
};

export default function CollectionListItem({ item }: CollectionListItemProps) {
  const navigation = useNavigation<any>();
  const goToCustomerList = () => {
    navigation.navigate('InvoiceList');
  };
  return (
    <View style={styles.collectionCard}>
      {/* Header Row */}
      <View style={styles.cardHeader}>
        {/* Left side - ID and Meter info */}
        <View style={styles.cardLeft}>
          <View style={styles.cardLeftRow}>
            <View style={styles.cardIdGroup}>
              <Text style={styles.cardIdLabel}>📋</Text>
              <Text style={styles.cardIdValue}>{item.id}</Text>
            </View>

            <View style={styles.cardIdGroup}>
              <Text style={styles.cardIdLabel}>📍</Text>
              <Text style={styles.cardMeterId}>{item.meterId}</Text>
            </View>
          </View>

          {/* Key metrics */}
          <View style={styles.cardDataRow}>
            <View style={styles.cardDataPair}>
              <Text style={styles.cardLabel}>Số HĐ:</Text>
              <Text style={styles.cardValue}>{item.soHD}</Text>
            </View>
            <View style={styles.cardDataPair}>
              <Text style={styles.cardLabel}>Đã thu:</Text>
              <Text style={styles.cardValue}>{item.daZhu}</Text>
            </View>
            <View style={styles.cardDataPair}>
              <Text style={styles.cardLabel}>Còn lại:</Text>
              <Text style={[styles.cardValue, styles.cardValueRed]}>
                {item.conLai}
              </Text>
            </View>
          </View>
        </View>

        {/* Right side - detailed amounts */}
        <View style={styles.cardRight}>
          <View style={styles.cardBadge}>
            <TouchableOpacity onPress={goToCustomerList} activeOpacity={0.7}>
              <Text style={styles.cardBadgeText}>📋 Danh sách hoá đơn</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardDataRow}>
            <Text style={styles.cardLabel}>Tổng tiền:</Text>
            <Text style={styles.cardValue}>{formatNumber(item.tongTien)}</Text>
          </View>

          <View style={styles.cardDataRow}>
            <Text style={styles.cardLabel}>Tiền thu:</Text>
            <Text style={[styles.cardValue, styles.cardValueGreen]}>
              {formatNumber(item.tienThu)}
            </Text>
          </View>

          <View style={styles.cardDataRow}>
            <Text style={styles.cardLabel}>Tiền còn lại:</Text>
            <Text style={[styles.cardValue, styles.cardValueRed]}>
              {formatNumber(item.tienConLai)}
            </Text>
          </View>
        </View>
      </View>

      {/* Detailed data section */}
      {item.soHDTon && (
        <View style={styles.detailSection}>
          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Số HĐ tờn:</Text>
              <Text style={styles.detailValue}>{item.soHDTon}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Tổng tiền tờn:</Text>
              <Text style={styles.detailValue}>
                {formatNumber(item.tongTienTon || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Đã thu tờn:</Text>
              <Text style={styles.detailValue}>{item.daZhuThuTon}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Tiền thu tờn:</Text>
              <Text style={[styles.detailValue, styles.detailValueRed]}>
                {formatNumber(item.tienThuThuTon || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Tổng tiền ơn:</Text>
              <Text style={styles.detailValue}>0</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Tiền ơn còn lại:</Text>
              <Text style={[styles.detailValue, styles.detailValueRed]}>
                {formatNumber(item.tienTonConLai || 0)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
