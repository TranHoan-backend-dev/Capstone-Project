import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import notificationService, { NotificationResponse } from '../services/notificationService';

// Standard mapping for notification display
interface NotificationItemProps {
  id: string;
  avatar: string;
  author: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'system' | 'mention' | 'update';
}

const mockNotifications: NotificationItemProps[] = [
  {
    id: 'm1',
    avatar: 'https://i.pravatar.cc/150?img=11',
    author: 'Hệ thống AI',
    content: 'đã phân tích xong lô ảnh đồng hồ nước hôm nay. Có 5 ảnh cần bạn kiểm tra lại do bị mờ.',
    timestamp: '2 giờ trước',
    isRead: false,
    type: 'system',
  },
  {
    id: 'm2',
    avatar: 'https://i.pravatar.cc/150?img=33',
    author: 'Quản lý Trần',
    content: 'đã duyệt toàn bộ danh sách chỉ số nước tuyến số 12.',
    timestamp: '4 giờ trước',
    isRead: false,
    type: 'update',
  },
  {
    id: 'm3',
    avatar: 'https://i.pravatar.cc/150?img=68',
    author: 'Nguyễn Văn Tiến',
    content: 'đã thắc mắc về chỉ số nước tháng này tại địa chỉ 621, Trường Chinh.',
    timestamp: 'Hôm qua lúc 15:30',
    isRead: true,
    type: 'mention',
  },
  {
    id: 'm4',
    avatar: 'https://i.pravatar.cc/150?img=12',
    author: 'Hệ thống bảo trì',
    content: 'thông báo lịch bảo trì máy chủ từ 23:00 đến 01:00 ngày mai.',
    timestamp: 'Thứ 2 lúc 09:00',
    isRead: true,
    type: 'system',
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<NotificationItemProps[]>(mockNotifications);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapToUI = useCallback((item: NotificationResponse): NotificationItemProps => {
    return {
      id: item.notificationId,
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default avatar
      author: item.title,
      content: item.message,
      timestamp: new Date(item.createdAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }),
      isRead: item.status, // true = read, false = unread
      type: 'system', // Default type
    };
  }, []);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await notificationService.getNotifications(0, 50);
      if (data && data.notifications) {
        const realNotifications = data.notifications.map(mapToUI);
        setNotifications([...realNotifications, ...mockNotifications]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mapToUI]);

  useEffect(() => {
    fetchNotifications();

    // Setup WebSocket for real-time updates
    notificationService.connect((newNotif) => {
      console.log('Received real-time notification:', newNotif);
      setNotifications((prev) => [mapToUI(newNotif), ...prev]);
    });

    return () => {
      notificationService.disconnect();
    };
  }, [fetchNotifications, mapToUI]);

  const onRefresh = () => {
    fetchNotifications(true);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
    // Ideally call API here
  };

  const renderItem = ({ item }: { item: NotificationItemProps }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(item.id)}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationText} numberOfLines={3}>
              <Text style={styles.authorName}>{item.author}</Text> {item.content}
            </Text>
          </View>
          <Text
            style={[
              styles.timestamp,
              !item.isRead && styles.unreadTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
        
        <IconButton
          icon="dots-horizontal"
          size={20}
          onPress={() => console.log('Options for', item.id)}
          style={styles.moreIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Thông báo</Text>
        </View>
        <IconButton icon="magnify" size={24} onPress={() => {}} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1876F2" />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Hiện chưa có thông báo mới</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#E7F3FF',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#050505',
  },
  authorName: {
    fontWeight: 'bold',
    color: '#050505',
  },
  timestamp: {
    fontSize: 13,
    color: '#65676B',
    marginTop: 4,
  },
  unreadTimestamp: {
    color: '#1876F2',
    fontWeight: '600',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1876F2',
    position: 'absolute',
    right: 48,
    top: '40%',
  },
  moreIcon: {
    margin: 0,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#65676B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#65676B',
    fontSize: 16,
  },
});
