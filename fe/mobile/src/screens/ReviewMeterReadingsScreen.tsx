import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, Card, IconButton, Portal, Modal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { meterService, PendingReview } from '../services/meterService';
import { showToast } from '../utils/toast';

const { height } = Dimensions.get('window');

export default function ReviewMeterReadingsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      setLoading(true);
      const data = await meterService.getPendingReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeReview = reviews[currentIndex];

  const handleAccept = async () => {
    if (!activeReview) return;
    try {
      setLoading(true);
      await meterService.confirmMeterReading(activeReview.id, activeReview.newIndexAI, 'APPROVED');
      showToast.success('Đã phê duyệt thành công');
      moveToNext();
    } catch (error) {
      console.error('Accept failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!activeReview || !editedValue) return;
    try {
      setLoading(true);
      await meterService.confirmMeterReading(activeReview.id, parseFloat(editedValue), 'APPROVED');
      showToast.success('Đã cập nhật chỉ số thủ công');
      setIsEditing(false);
      moveToNext();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveToNext = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setEditedValue('');
    } else {
      showToast.info('Đã hoàn thành toàn bộ danh sách duyệt');
      navigation.goBack();
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Đang tải danh sách chờ duyệt...</Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="check-circle-outline" size={80} color="#10B981" />
        <Text style={styles.emptyText}>Không có chỉ số nào cần duyệt hôm nay!</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
          Quay lại
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>
          Duyệt chỉ số ({currentIndex + 1}/{reviews.length})
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.reviewCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: activeReview.imageUrl }}
              style={styles.meterImage}
              resizeMode="cover"
            />
            <View style={styles.badgeAI}>
              <Icon name="robot-outline" size={16} color="#fff" />
              <Text style={styles.badgeText}>AI PROCESSED</Text>
            </View>
          </View>

          <Card.Content style={styles.infoContent}>
            <View style={styles.customerHeader}>
              <Text style={styles.customerName}>{activeReview.customerName}</Text>
              <Text style={styles.customerId}>ID: {activeReview.customerId}</Text>
            </View>
            <Text style={styles.addressText}>{activeReview.address}</Text>

            <View style={styles.divider} />

            <View style={styles.indexRow}>
              <View style={styles.indexItem}>
                <Text style={styles.indexLabel}>Chỉ số cũ</Text>
                <Text style={styles.indexValue}>{activeReview.oldIndex}</Text>
                <Text style={styles.serialSmall}>SN: {activeReview.serial}</Text>
              </View>

              <Icon name="arrow-right" size={24} color="#94A3B8" />

              <View style={styles.indexItem}>
                <Text style={[styles.indexLabel, { color: '#10B981' }]}>Chỉ số mới (AI)</Text>
                <Text style={[styles.indexValue, { color: '#10B981' }]}>{activeReview.newIndexAI}</Text>
                <Text style={styles.serialSmall}>SN: {activeReview.serial}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footerActions}>
        <Button
          mode="outlined"
          icon="pencil"
          style={styles.actionBtn}
          onPress={() => {
            setEditedValue(activeReview.newIndexAI.toString());
            setIsEditing(true);
          }}
        >
          Sửa lại
        </Button>
        <Button
          mode="contained"
          buttonColor="#10B981"
          style={[styles.actionBtn, styles.acceptBtn]}
          onPress={handleAccept}
          labelStyle={styles.acceptLabel}
        >
          Phê duyệt
        </Button>
      </View>

      <Portal>
        <Modal
          visible={isEditing}
          onDismiss={() => setIsEditing(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Chỉnh sửa chỉ số</Text>
          <TextInput
            mode="outlined"
            label="Chỉ số chính xác"
            keyboardType="numeric"
            value={editedValue}
            onChangeText={setEditedValue}
            autoFocus
          />
          <View style={styles.modalActions}>
            <Button onPress={() => setIsEditing(false)}>Hủy</Button>
            <Button mode="contained" onPress={handleEditSave}>Lưu & Duyệt</Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerSpacer: { width: 48 },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  reviewCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: '100%',
    height: height * 0.45,
    position: 'relative',
  },
  meterImage: {
    width: '100%',
    height: '100%',
  },
  badgeAI: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  infoContent: {
    paddingVertical: 20,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  customerId: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  indexRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  indexItem: {
    alignItems: 'center',
  },
  indexLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  indexValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
  },
  serialSmall: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  footerActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
  },
  acceptBtn: {
    flex: 1.5,
  },
  acceptLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    borderRadius: 12,
    width: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E293B',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
});
