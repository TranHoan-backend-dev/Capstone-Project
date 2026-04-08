import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  IconButton,
  Text,
  TextInput,
  Button,
  Menu,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import {
  localCapturedService,
  AuditRecord,
} from '../services/localCapturedService';
import { meterService, PendingReview } from '../services/meterService';
import { customerService } from '../services/customerService';
import { storageService } from '../services/storageService';
import { showToast } from '../utils/toast';
import { roadmapService } from '../services/roadmapService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.22;
const IMAGE_AREA_HEIGHT = 300;

type QueueSource = 'local' | 'server';

export interface HybridReviewItem {
  id: string;
  source: QueueSource;
  photoUri?: string;
  imageUrl?: string;
  customerId?: string;
  customerName?: string;
  address?: string;
  aiIndex: number;
  aiSerial: string;
  oldIndex?: number;
  timestamp?: string;
}

export interface Roadmap {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  totalCustomer?: number;
}

function mapLocal(r: AuditRecord): HybridReviewItem {
  const idx =
    typeof r.aiIndex === 'string' ? parseFloat(r.aiIndex) : Number(r.aiIndex);
  return {
    id: r.id,
    source: 'local',
    photoUri: r.photoUri,
    customerId: r.customerId,
    customerName: r.customerName,
    aiIndex: Number.isFinite(idx) ? idx : 0,
    aiSerial: (r.aiSerial || '').trim(),
    timestamp: r.timestamp,
  };
}

function mapServer(p: PendingReview): HybridReviewItem {
  return {
    id: p.id,
    source: 'server',
    imageUrl: p.imageUrl,
    customerId: p.customerId,
    customerName: p.customerName,
    address: p.address,
    aiIndex:
      typeof p.newIndexAI === 'number'
        ? p.newIndexAI
        : parseFloat(String(p.newIndexAI)),
    aiSerial: (p.serial || '').trim(),
    oldIndex:
      typeof p.oldIndex === 'number'
        ? p.oldIndex
        : parseFloat(String(p.oldIndex)),
  };
}

function hasSerial(s: string): boolean {
  return !!s && s.trim() !== '' && s !== 'N/A';
}

export default function ImageReviewScreen() {
  const navigation = useNavigation();
  const [queue, setQueue] = useState<HybridReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [displayUri, setDisplayUri] = useState<string | null>(null);
  const [editSerial, setEditSerial] = useState('');
  const [editIndex, setEditIndex] = useState('');

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [roadmapIdInput, setRoadmapIdInput] = useState('');
  const [pickerCustomers, setPickerCustomers] = useState<any[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  // Roadmap selection states
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);

  const current = queue[0] ?? null;
  const remain = Math.max(0, queue.length - 1);

  // Load danh sách roadmap khi component mount
  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      // Truyền 3 tham số vào hàm getMyRoadmaps
      const data = await roadmapService.getMyRoadmaps('', '', '');
      console.log('Loaded roadmaps:', data);
      if (data && data.length > 0) {
        const convertedRoadmaps: Roadmap[] = data.map(route => ({
          id: route.id,
          name: route.name,
          description: route.type,
          totalCustomer: route.totalCustomer,
        }));
        setRoadmaps(convertedRoadmaps);
        setSelectedRoadmapId(convertedRoadmaps[0].id);
      } else {
        console.log('No roadmaps found, manual input mode');
      }
    } catch (error) {
      console.error('Failed to load roadmaps:', error);
    }
  };

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const localRecords = await localCapturedService.getAuditRecords();
      let serverPending: PendingReview[] = [];

      try {
        // Sử dụng selectedRoadmapId để gọi API
        const options: { silent: boolean; roadmapId?: string } = {
          silent: true,
        };
        if (selectedRoadmapId) {
          options.roadmapId = selectedRoadmapId;
          console.log(
            'Loading pending reviews for roadmap:',
            selectedRoadmapId,
          );
        } else {
          console.log('Loading all pending reviews (no roadmap filter)');
        }

        serverPending = await meterService.getPendingReviews(options);
        console.log(`Loaded ${serverPending.length} pending reviews`);
      } catch (error) {
        console.error('Failed to load server pending reviews:', error);
        serverPending = [];
      }

      const localIds = new Set(localRecords.map(r => r.id));
      const localItems = localRecords.map(mapLocal);
      const serverOnly = serverPending
        .filter(p => !localIds.has(p.id))
        .map(mapServer);

      const byTime = (a: HybridReviewItem, b: HybridReviewItem) => {
        const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return tb - ta;
      };
      localItems.sort(byTime);

      const newQueue = [...localItems, ...serverOnly];
      setQueue(newQueue);

      if (newQueue.length === 0 && selectedRoadmapId) {
        showToast.info(`Không có chỉ số nào cần duyệt trong lộ trình này`);
      }
    } catch (e) {
      console.error('[ImageReview] loadQueue', e);
      showToast.error('Không tải được danh sách duyệt');
    } finally {
      setLoading(false);
    }
  }, [selectedRoadmapId]);

  // Reload khi roadmap thay đổi
  useEffect(() => {
    if (selectedRoadmapId !== undefined) {
      loadQueue();
    }
  }, [selectedRoadmapId, loadQueue]);

  useEffect(() => {
    if (!current) {
      setDisplayUri(null);
      setEditSerial('');
      setEditIndex('');
      return;
    }
    setEditSerial(current.aiSerial);
    setEditIndex(
      String(Number.isFinite(current.aiIndex) ? current.aiIndex : 0),
    );

    let cancelled = false;
    (async () => {
      if (current.source === 'local' && current.photoUri) {
        if (!cancelled) setDisplayUri(current.photoUri);
        return;
      }
      const raw = current.imageUrl || '';
      const resolved = await storageService.getImageUrl(raw);
      if (!cancelled) setDisplayUri(resolved || raw || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [current?.id, current?.photoUri, current?.imageUrl, current?.source]);

  const resetCardPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [position]);

  const popFront = useCallback(() => {
    setQueue(q => q.slice(1));
    position.setValue({ x: 0, y: 0 });
  }, [position]);

  const confirmAndSync = useCallback(async () => {
    if (!current || submitting) return;
    const finalIndex = parseFloat(editIndex.replace(',', '.'));
    if (!Number.isFinite(finalIndex)) {
      showToast.error('Chỉ số không hợp lệ');
      return;
    }
    if (!hasSerial(editSerial) && !current.customerId) {
      showToast.error('Thiếu serial hoặc chưa chọn khách hàng');
      return;
    }

    setSubmitting(true);
    try {
      // TC11: nếu có serial thì cập nhật thủ công chỉ số theo serial trước khi confirm
      if (hasSerial(editSerial)) {
        const date = new Date().toISOString().split('T')[0];
        await meterService.updateUsageManual(
          editSerial.trim(),
          date,
          finalIndex,
          { silent: true },
        );
      }

      // TC10: confirm bản ghi đã phân tích AI
      await meterService.confirmMeterReading(
        current.id,
        finalIndex,
        'APPROVED',
        { silent: true },
      );
      if (current.source === 'local') {
        await localCapturedService.removeAuditRecord(current.id);
      }
      showToast.success('Đã duyệt chỉ số');
      popFront();
    } catch (e) {
      console.error('[ImageReview] confirm', e);
      showToast.error('Không đồng bộ được với máy chủ');
      resetCardPosition();
    } finally {
      setSubmitting(false);
    }
  }, [current, submitting, editIndex, editSerial, popFront, resetCardPosition]);

  const runSwipeOut = useCallback(() => {
    const toX = SCREEN_WIDTH * 1.4;
    Animated.timing(position, {
      toValue: { x: toX, y: 0 },
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      confirmAndSync();
    });
  }, [position, confirmAndSync]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !submitting,
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => {
          position.setValue({ x: g.dx, y: g.dy * 0.15 });
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) {
            runSwipeOut();
          } else {
            resetCardPosition();
          }
        },
      }),
    [submitting, position, runSwipeOut, resetCardPosition],
  );

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-8deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const loadPickerCustomers = async () => {
    if (!roadmapIdInput.trim()) {
      showToast.error('Nhập mã lộ trình để tải danh sách khách hàng');
      return;
    }
    setPickerLoading(true);
    try {
      const res = await customerService.getCustomersByRoadmap(
        roadmapIdInput.trim(),
        '',
        0,
      );
      const list = res.content || [];
      setPickerCustomers(list);
      if (list.length === 0)
        showToast.info('Không có khách hàng trên lộ trình này');
    } catch (e) {
      console.error(e);
      showToast.error('Không tải được danh sách khách hàng');
    } finally {
      setPickerLoading(false);
    }
  };

  const onPickCustomer = async (c: {
    customerId: string;
    name?: string;
    address?: string;
  }) => {
    if (!current) return;
    await localCapturedService.updateAuditRecord(current.id, {
      customerId: c.customerId,
      customerName: c.name || c.customerId,
    });
    setQueue(q =>
      q.map(item =>
        item.id === current.id
          ? {
              ...item,
              customerId: c.customerId,
              customerName: c.name || item.customerName,
            }
          : item,
      ),
    );
    setPickerOpen(false);
    showToast.success('Đã gán khách hàng cho bản ghi');
  };

  const handleRoadmapChange = (roadmapId: string) => {
    setSelectedRoadmapId(roadmapId);
    setMenuVisible(false);
    setQueue([]);
  };

  const serialMissing = current
    ? !hasSerial(editSerial) && !current.customerId
    : false;

  const getSelectedRoadmapName = () => {
    if (roadmaps.length === 0) return 'Tất cả';
    const roadmap = roadmaps.find(r => r.id === selectedRoadmapId);
    return roadmap?.name || 'Chọn lộ trình';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Duyệt chỉ số</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          {roadmaps.length > 0 ? (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="text"
                  onPress={() => setMenuVisible(true)}
                  icon="map-marker"
                  labelStyle={styles.roadmapLabel}
                  compact
                >
                  {getSelectedRoadmapName()}
                </Button>
              }
            >
              {roadmaps.map(roadmap => (
                <Menu.Item
                  key={roadmap.id}
                  onPress={() => handleRoadmapChange(roadmap.id)}
                  title={roadmap.name}
                  titleStyle={
                    selectedRoadmapId === roadmap.id && styles.selectedMenuItem
                  }
                />
              ))}
            </Menu>
          ) : null}
          <TouchableOpacity onPress={loadQueue} style={styles.reloadButton}>
            <Text style={styles.reloadText}>Tải lại</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.muted}>Đang tải danh sách…</Text>
        </View>
      ) : !current ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Không có bản ghi chờ duyệt</Text>
          {selectedRoadmapId && roadmaps.length > 0 && (
            <Chip
              icon="map-marker"
              style={styles.chip}
              onPress={() => setMenuVisible(true)}
            >
              Lộ trình: {getSelectedRoadmapName()}
            </Chip>
          )}
          <Button
            mode="contained"
            onPress={loadQueue}
            style={{ marginTop: 16 }}
          >
            Làm mới
          </Button>
        </View>
      ) : (
        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Text style={styles.metaBadge}>Còn lại: {remain}</Text>
            <Text style={[styles.metaBadge, styles.metaMuted]}>
              {current.source === 'local' ? 'Ảnh máy (nhanh)' : 'Ảnh server'}
            </Text>
          </View>

          {/* Hiển thị roadmap đang chọn */}
          {selectedRoadmapId && roadmaps.length > 0 && (
            <Chip
              icon="map-marker"
              style={styles.roadmapChip}
              onPress={() => setMenuVisible(true)}
            >
              Lộ trình: {getSelectedRoadmapName()}
            </Chip>
          )}

          <Text style={styles.hintSwipe}>
            Vuốt phải hoặc bấm nút để duyệt (sửa chỉ số trước khi duyệt nếu cần)
          </Text>

          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              },
            ]}
          >
            <View style={styles.swipeImageArea} {...panResponder.panHandlers}>
              {displayUri ? (
                <Image
                  source={{ uri: displayUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.image, styles.imagePh]}>
                  <ActivityIndicator color="#93C5FD" />
                </View>
              )}
              <Animated.View
                style={[
                  styles.stamp,
                  styles.stampLike,
                  { opacity: likeOpacity },
                ]}
              >
                <Text style={styles.stampTextLike}>DUYỆT</Text>
              </Animated.View>
            </View>

            <ScrollView
              style={styles.formScroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              <Text style={styles.customerTitle} numberOfLines={2}>
                {current.customerName || 'Chưa gán khách hàng'}
              </Text>
              {current.address ? (
                <Text style={styles.address}>{current.address}</Text>
              ) : null}
              {current.oldIndex != null &&
              !Number.isNaN(Number(current.oldIndex)) ? (
                <Text style={styles.oldIdx}>
                  Chỉ số kỳ trước: {String(current.oldIndex)}
                </Text>
              ) : null}

              {serialMissing && (
                <View style={styles.warnBox}>
                  <Text style={styles.warnText}>
                    Chưa có serial và chưa gán khách hàng — chọn khách hàng hoặc
                    nhập serial.
                  </Text>
                  <Button
                    mode="outlined"
                    onPress={() => setPickerOpen(true)}
                    compact
                  >
                    Chọn khách hàng theo lộ trình
                  </Button>
                </View>
              )}

              <TextInput
                mode="outlined"
                label="Số serial đồng hồ"
                value={editSerial}
                onChangeText={setEditSerial}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Chỉ số duyệt"
                value={editIndex}
                onChangeText={setEditIndex}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </ScrollView>
          </Animated.View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.approve]}
              disabled={submitting}
              onPress={runSwipeOut}
            >
              <Text style={styles.btnText}>Duyệt</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Gán khách hàng</Text>
            <Text style={styles.modalHint}>
              Nhập mã lộ trình đã đồng bộ, rồi tải danh sách.
            </Text>
            <TextInput
              mode="outlined"
              label="Mã lộ trình"
              value={roadmapIdInput}
              onChangeText={setRoadmapIdInput}
              style={styles.input}
            />
            <Button
              mode="contained-tonal"
              onPress={loadPickerCustomers}
              loading={pickerLoading}
            >
              Tải danh sách
            </Button>
            <ScrollView style={{ maxHeight: 280, marginTop: 12 }}>
              {pickerCustomers.map(c => (
                <TouchableOpacity
                  key={c.customerId}
                  style={styles.pickerRow}
                  onPress={() => onPickCustomer(c)}
                >
                  <Text style={styles.pickerName}>
                    {c.name || c.customerId}
                  </Text>
                  <Text style={styles.pickerAddr} numberOfLines={2}>
                    {c.address || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              onPress={() => setPickerOpen(false)}
              style={{ marginTop: 8 }}
            >
              Đóng
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerTitles: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  headerSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  reloadButton: { padding: 8 },
  reloadText: { color: '#1E88E5', fontWeight: '700' },
  roadmapLabel: { fontSize: 12 },
  selectedMenuItem: { color: '#1E88E5', fontWeight: 'bold' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  muted: { marginTop: 8, color: '#64748b' },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  emptyDesc: {
    marginTop: 8,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  body: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaBadge: {
    backgroundColor: '#DBEAFE',
    color: '#1e3a8a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 12,
  },
  metaMuted: { backgroundColor: '#F1F5F9', color: '#475569' },
  roadmapChip: { marginBottom: 8, alignSelf: 'flex-start' },
  hintSwipe: { fontSize: 12, color: '#64748b', marginBottom: 8 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 8,
  },
  swipeImageArea: {
    height: IMAGE_AREA_HEIGHT,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imagePh: { justifyContent: 'center', alignItems: 'center' },
  stamp: {
    position: 'absolute',
    top: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderRadius: 8,
  },
  stampLike: {
    right: 16,
    borderColor: '#22c55e',
    transform: [{ rotate: '12deg' }],
  },
  stampTextLike: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#16a34a',
  },
  formScroll: { maxHeight: 260, paddingHorizontal: 12, paddingBottom: 8 },
  customerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 10,
  },
  address: { fontSize: 14, color: '#475569', marginTop: 4 },
  oldIdx: { fontSize: 13, color: '#64748b', marginTop: 4 },
  warnBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  warnText: { fontSize: 13, color: '#9a3412', marginBottom: 8 },
  input: { marginTop: 8, backgroundColor: '#fff' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  approve: { backgroundColor: '#16a34a' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '90%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalHint: { fontSize: 13, color: '#64748b', marginVertical: 8 },
  pickerRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerName: { fontWeight: '700', color: '#0f172a' },
  pickerAddr: { fontSize: 12, color: '#64748b', marginTop: 2 },
  chip: { marginTop: 12 },
});
