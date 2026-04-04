import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Appbar, Portal, Modal, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import InvoiceDetailCard from '../components/layout/invoice-detail/InvoiceDetailCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceDetail'>;

const MOCK_INVOICES = [
  {
    customerId: '015281',
    status: 'collected',
    khoaKy: '12/2025',
    soHD: 584,
    soHDMoi: 588,
    m3: 4,
    tienThu: 39560,
    tienNo: 0,
    ngayThu: '12/01/2026 08:16',
    nvThu: 'payoo',
    daXemHoaDon: true,
    daXemHinh: true,
  },
];

import { meterService } from '../services/meterService';
import { useEffect } from 'react';

export default function InvoiceDetailScreen({ navigation, route }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const customerId = route.params?.customerId || '015281';
        const recentData = await meterService.getRecentUsage(customerId);

        if (recentData && recentData.usagesList && recentData.usagesList.length > 0) {
          const latest = recentData.usagesList[0];
          const previous = recentData.usagesList.length > 1 ? recentData.usagesList[1] : null;

          setInvoiceData({
            customerId: recentData.customerId,
            status: latest.isPaid ? 'collected' : 'pending',
            khoaKy: latest.recordingDate.substring(0, 7), // YYYY-MM
            soHD: previous ? previous.index : (latest.index - latest.mass), // Mock previous index if missing
            soHDMoi: latest.index,
            m3: latest.mass,
            tienThu: latest.price,
            // Mock data starts below
            tienNo: 0, // Mock: Tiền nợ hiện chưa có API trả về
            ngayThu: latest.recordingDate,
            nvThu: latest.paymentMethod || 'Payoo', // Mock: mặc định Payoo nếu null
            // Mock data ends above
            imageUrl: latest.meterImageUrl
          });
        } else {
          setInvoiceData(MOCK_INVOICES[0]);
        }
      } catch (error) {
        console.error('Fetch invoice failed:', error);
        setInvoiceData(MOCK_INVOICES[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [route.params?.customerId]);

  const invoice = invoiceData || MOCK_INVOICES[currentIndex];

  useEffect(() => {
    if (loading) {
      // Logic for loading state if needed
    }
  }, [loading]);

  const handleNext = () => {
    if (currentIndex < MOCK_INVOICES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin hoá đơn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#333" />
        <Appbar.Content title="Thu tiền" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Customer Info Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="account-circle" size={24} color="#fff" />
              <Text style={styles.cardTitleText}>
                {route.params?.customerName || 'N/A'}
              </Text>
            </View>
            <Icon name="dots-horizontal-circle-outline" size={24} color="#fff" />
          </View>

          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <View style={styles.row}>
                <Icon name="card-account-details-outline" size={20} color="#1E88E5" style={styles.marginRight8} />
                <Text style={styles.infoLabel}>STT</Text>
                <Text style={styles.infoValue}>1</Text>
              </View>
            </View>

            <View style={styles.addressRow}>
              <Icon name="map-marker-outline" size={20} color="#1E88E5" style={styles.marginRight8} />
              <Text style={[styles.infoLabel, styles.marginRight8]}>Địa chỉ</Text>
              <Text style={styles.addressText}>
                {route.params?.address || 'N/A'}
              </Text>
            </View>

            <View style={styles.phoneRow}>
              <Icon name="phone-outline" size={20} color="#1E88E5" style={styles.marginRight8} />
              <Text style={[styles.infoLabel, styles.marginRight8]}>Điện thoại</Text>
              <Text style={styles.phoneValue}>
                {route.params?.phone || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice List Header */}
        <View style={styles.listHeader}>
          <Icon name="format-list-bulleted" size={20} color="#fff" style={styles.marginRight8} />
          <Text style={styles.listHeaderText}>Danh sách hoá đơn</Text>
        </View>

        {/* Invoice Detail Card (Yellow) */}
        <InvoiceDetailCard
          status={invoice.status as any}
          khoaKy={invoice.khoaKy}
          soHD={invoice.soHD}
          soHDMoi={invoice.soHDMoi}
          m3={invoice.m3}
          tienThu={invoice.tienThu}
          tienNo={invoice.tienNo}
          ngayThu={invoice.ngayThu}
          nvThu={invoice.nvThu}
          onShowReceipt={() => setShowReceipt(true)}
          onShowImage={() => setShowImage(true)}
        />
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButtonLeft}
          onPress={handlePrev}
        >
          <Text style={styles.footerArrow}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButtonCenter}
        >
          <Text style={styles.footerButtonText}>Thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButtonRight}
          onPress={handleNext}
        >
          <Text style={styles.footerArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal View for Receipt (Image 2) */}
      <Portal>
        <Modal
          visible={showReceipt}
          onDismiss={() => setShowReceipt(false)}
          contentContainerStyle={{ backgroundColor: '#fff', margin: 20, borderRadius: 8, padding: 0, overflow: 'hidden' }}
        >
          <View style={styles.modalHeader}>
            <Icon name="file-document-outline" size={24} color="#666" style={styles.marginRight8} />
            <Text style={styles.modalTitle}>Giấy báo tiền nước</Text>
            <IconButton icon="close-circle" iconColor="#D32F2F" onPress={() => setShowReceipt(false)} />
          </View>
          <ScrollView style={styles.receiptScroll}>
            <View style={styles.receiptHeaderSection}>
              <Text style={styles.receiptCompanyText}>CÔNG TY CP CẤP NƯỚC NAM ĐỊNH</Text>
              <Text style={styles.receiptAdressText}>30 Cù Chính Lan, Phường Nam Định</Text>
              <Text style={styles.receiptAdressText}>MST: 6000000000</Text>
              <Text style={styles.receiptMainTitle}>GIẤY BÁO TIỀN NƯỚC</Text>
              <Text style={styles.receiptSubtitle}>Kỳ HĐ: 12/2025</Text>
            </View>
            <View style={styles.receiptInfoSection}>
              <Text>Từ ngày: 25/11/2025</Text>
              <Text>đến ngày: 24/12/2025</Text>
              <Text>Tên KH: Trần đăng Long</Text>
              <Text>Địa chỉ: 24/605 Trường Chinh, Phường Nam Định</Text>
              <Text>Mã KH: 015329</Text>
            </View>
            <View style={styles.receiptTableContainer}>
              {/* Header row */}
              <View style={styles.receiptTableHeaderRow}>
                <Text style={styles.receiptTableCellCenterBorder}>MĐ</Text>
                <Text style={styles.receiptTableCellCenterBorder}>M3</Text>
                <Text style={styles.receiptTableCellCenterBorder}>Giá</Text>
                <Text style={styles.receiptTableCellLarge}>Thành tiền</Text>
              </View>
              {/* Data row */}
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableCellBorder}>Nước SH1</Text>
                <Text style={styles.receiptTableCellCenterBorder}>5</Text>
                <Text style={styles.receiptTableCellRightBorder}>8.600</Text>
                <Text style={styles.receiptTableCellLargeRight}>43.000</Text>
              </View>
              <View style={styles.receiptFooter}>
                <Text style={styles.receiptFooterText}>Cộng: 43.000</Text>
                <Text style={styles.receiptFooterText}>Thuế suất 5%: 2.150</Text>
                <Text style={styles.receiptFooterText}>Thành tiền: 45.150</Text>
                <Text style={styles.receiptTotalText}>Tổng cộng: 49.450</Text>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Modal View for Image (Image 3) */}
      <Portal>
        <Modal
          visible={showImage}
          onDismiss={() => setShowImage(false)}
          contentContainerStyle={{ backgroundColor: '#fff', margin: 40, borderRadius: 8, padding: 0 }}
        >
          <View style={styles.modalHeader}>
            <Icon name="image-outline" size={24} color="#666" style={styles.marginRight8} />
            <Text style={styles.modalTitle}>Hình ảnh đính kèm</Text>
            <IconButton icon="close-circle" iconColor="#D32F2F" onPress={() => setShowImage(false)} />
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Icon name="water-pump" size={80} color="#666" />
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 1,
  },
  headerTitle: {
    color: '#333',
    fontSize: 18,
  },
  scrollContent: {
    flex: 1,
    padding: 12,
  },
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  cardHeader: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  cardBody: {
    padding: 12,
    backgroundColor: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginLeft: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  listHeader: {
    backgroundColor: '#1E88E5',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 4,
  },
  listHeaderText: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    height: 60,
  },
  footerButtonLeft: {
    flex: 1,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  footerButtonRight: {
    flex: 1,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
  },
  footerButtonCenter: {
    flex: 2,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  footerArrow: {
    color: '#fff',
    fontSize: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 0,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  marginRight8: {
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptScroll: {
    padding: 12,
    maxHeight: 500,
  },
  receiptHeaderSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptCompanyText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  receiptAdressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  receiptMainTitle: {
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
  },
  receiptSubtitle: {
    fontSize: 14,
  },
  receiptInfoSection: {
    gap: 4,
    marginBottom: 16,
  },
  receiptTableContainer: {
    borderWidth: 1,
    borderColor: '#333',
  },
  receiptTableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#f9f9f9',
  },
  receiptTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  receiptTableCellBorder: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  receiptTableCellCenterBorder: {
    flex: 1,
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  receiptTableCellRightBorder: {
    flex: 1,
    padding: 4,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  receiptTableCellLarge: {
    flex: 1.5,
    padding: 4,
    textAlign: 'center',
  },
  receiptTableCellLargeRight: {
    flex: 1.5,
    padding: 4,
    textAlign: 'right',
  },
  receiptFooter: {
    padding: 4,
  },
  receiptFooterText: {
    textAlign: 'right',
  },
  receiptTotalText: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
