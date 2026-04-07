import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton, Menu, Text, TextInput } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import imageReviewService, {
  MeterImageReviewItem,
  routeKeyOfItem,
} from '../services/imageReviewService';
import { storageService } from '../services/storageService';
import { showToast } from '../utils/toast';

export default function ImageReviewScreen() {
  const navigation = useNavigation();
  const [allItems, setAllItems] = useState<MeterImageReviewItem[]>([]);
  const [selectedRouteKey, setSelectedRouteKey] = useState<string | null>(null);
  const [routeMenuVisible, setRouteMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [displayImageUri, setDisplayImageUri] = useState<string | null>(null);

  const [editSerial, setEditSerial] = useState('');
  const [editCurrent, setEditCurrent] = useState('');
  const [editPrevious, setEditPrevious] = useState('');

  const routeOptions = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();
    for (const item of allItems) {
      const key = routeKeyOfItem(item);
      const label = item.routeName;
      const prev = map.get(key);
      if (prev) {
        prev.count += 1;
      } else {
        map.set(key, { key, label, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, 'vi'));
  }, [allItems]);

  const queue = useMemo(() => {
    if (!selectedRouteKey) return [];
    return allItems.filter((i) => routeKeyOfItem(i) === selectedRouteKey);
  }, [allItems, selectedRouteKey]);

  const currentItem = useMemo(() => queue[0] || null, [queue]);
  const remainCount = queue.length > 0 ? queue.length - 1 : 0;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await imageReviewService.getPendingImages(0, 100);
      setAllItems(data);
    } catch (error) {
      console.error('Load review images failed:', error);
      showToast.error('Không tải được danh sách ảnh cần kiểm tra');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (allItems.length === 0) {
      setSelectedRouteKey(null);
      return;
    }
    setSelectedRouteKey((prev) => {
      if (prev && routeOptions.some((o) => o.key === prev)) return prev;
      return routeOptions[0]?.key ?? routeKeyOfItem(allItems[0]);
    });
  }, [allItems, routeOptions]);

  useEffect(() => {
    if (!currentItem) {
      setDisplayImageUri(null);
      setEditSerial('');
      setEditCurrent('');
      setEditPrevious('');
      return;
    }
    setEditSerial(currentItem.meterSerial);
    setEditCurrent(currentItem.currentReading);
    setEditPrevious(currentItem.previousReading);

    let cancelled = false;
    (async () => {
      const resolved = await storageService.getImageUrl(currentItem.imageUrl);
      if (!cancelled) {
        setDisplayImageUri(resolved || currentItem.imageUrl);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentItem?.id, currentItem?.imageUrl]);

  const removeCurrentFromAll = (id: string) => {
    setAllItems((prev) => prev.filter((x) => x.id !== id));
  };

  const removeCurrentCard = () =>
    new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 360,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        translateX.setValue(0);
        opacity.setValue(1);
        resolve();
      });
    });

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!currentItem || submitting) return;

    setSubmitting(true);
    try {
      await imageReviewService.reviewImage(currentItem.id, {
        decision,
        note: '',
        meterSerial: editSerial.trim(),
        currentReading: editCurrent.trim(),
        previousReading: editPrevious.trim(),
        roadmapId: currentItem.roadmapId || undefined,
      });
      await removeCurrentCard();
      removeCurrentFromAll(currentItem.id);
      showToast.success(decision === 'APPROVED' ? 'Đã duyệt ảnh' : 'Đã từ chối ảnh');
    } catch (error) {
      console.error('Review image failed:', error);
      showToast.error('Không thể cập nhật kết quả duyệt');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRouteLabel =
    routeOptions.find((o) => o.key === selectedRouteKey)?.label ?? 'Chọn lộ trình';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Kiểm tra hình ảnh</Text>
        </View>
        <TouchableOpacity onPress={loadData}>
          <Text style={styles.reloadText}>Tải lại</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Đang tải ảnh đồng hồ...</Text>
        </View>
      ) : allItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Không còn ảnh cần duyệt</Text>
          <Text style={styles.emptyDescription}>Bạn đã xử lý hết danh sách hiện tại.</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
            <Text style={styles.refreshBtnText}>Làm mới danh sách</Text>
          </TouchableOpacity>
        </View>
      ) : !currentItem ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Không còn ảnh trong lộ trình này</Text>
          <Text style={styles.emptyDescription}>Chọn lộ trình khác hoặc làm mới danh sách.</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
            <Text style={styles.refreshBtnText}>Làm mới danh sách</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.body}>
          <View style={styles.topMetaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Còn lại: {remainCount} ảnh (lộ trình này)</Text>
            </View>
            <View style={[styles.badge, styles.badgeMuted]}>
              <Text style={[styles.badgeText, styles.badgeTextMuted]}>Tổng: {allItems.length}</Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX }],
                opacity,
              },
            ]}
          >
            <View style={styles.routeBar}>
              <Text style={styles.routeBarHint}>Lộ trình ghi</Text>
              <Menu
                visible={routeMenuVisible}
                onDismiss={() => setRouteMenuVisible(false)}
                anchor={
                  <Pressable style={styles.routeAnchor} onPress={() => setRouteMenuVisible(true)}>
                    <Text style={styles.routeAnchorText} numberOfLines={1}>
                      {selectedRouteLabel}
                    </Text>
                    <Text style={styles.routeAnchorChevron}>▾</Text>
                  </Pressable>
                }
                contentStyle={styles.routeMenuContent}
              >
                {routeOptions.map((opt) => (
                  <Menu.Item
                    key={opt.key}
                    onPress={() => {
                      setSelectedRouteKey(opt.key);
                      setRouteMenuVisible(false);
                    }}
                    title={`${opt.label} (${opt.count})`}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.imageWrap}>
              {displayImageUri ? (
                <Image source={{ uri: displayImageUri }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <ActivityIndicator size="large" color="#93C5FD" />
                </View>
              )}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.customerName} numberOfLines={2}>
                {currentItem.customerName}
              </Text>

              <Text style={styles.addressText} numberOfLines={2}>
                {currentItem.customerAddress}
              </Text>

              <View style={styles.divider} />

              <TextInput
                mode="outlined"
                label="Số serial đồng hồ"
                value={editSerial}
                onChangeText={setEditSerial}
                dense
                style={styles.input}
              />
              <View style={styles.readingInputsRow}>
                <TextInput
                  mode="outlined"
                  label="Chỉ số tháng này"
                  value={editCurrent}
                  onChangeText={setEditCurrent}
                  keyboardType="decimal-pad"
                  dense
                  style={[styles.input, styles.inputHalf]}
                />
                <TextInput
                  mode="outlined"
                  label="Chỉ số tháng trước"
                  value={editPrevious}
                  onChangeText={setEditPrevious}
                  keyboardType="decimal-pad"
                  dense
                  style={[styles.input, styles.inputHalf]}
                />
              </View>
            </View>
          </Animated.View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn, submitting && styles.disabledBtn]}
              disabled={submitting}
              onPress={() => handleDecision('REJECTED')}
            >
              <Text style={styles.actionText}>Từ chối</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn, submitting && styles.disabledBtn]}
              disabled={submitting}
              onPress={() => handleDecision('APPROVED')}
            >
              <Text style={styles.actionText}>Duyệt</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FB',
  },
  header: {
    paddingHorizontal: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E7EF',
    backgroundColor: '#FFFFFF',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  reloadText: {
    color: '#1E88E5',
    fontWeight: '600',
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
  },
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
  },
  topMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E8F2FF',
    borderWidth: 1,
    borderColor: '#D6E6FF',
  },
  badgeMuted: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  badgeTextMuted: {
    color: '#374151',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
  },
  routeBar: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  routeBarHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  routeAnchor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  routeAnchorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  routeAnchorChevron: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  routeBarSub: {
    marginTop: 8,
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  routeMenuContent: {
    maxHeight: 320,
  },
  imageWrap: {
    backgroundColor: '#0B1220',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#1E293B',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2F7',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  readingInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  inputHalf: {
    flex: 1,
    width: '48%',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '48%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    backgroundColor: '#DC2626',
  },
  approveBtn: {
    backgroundColor: '#16A34A',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  emptyDescription: {
    marginTop: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
  refreshBtn: {
    marginTop: 18,
    backgroundColor: '#1E88E5',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  refreshBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
