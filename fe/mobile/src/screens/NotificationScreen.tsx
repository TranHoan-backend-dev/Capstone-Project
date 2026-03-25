import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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
    id: '1',
    avatar: 'https://i.pravatar.cc/150?img=11',
    author: 'Hệ thống AI',
    content: 'đã phân tích xong lô ảnh đồng hồ nước hôm nay. Có 5 ảnh cần bạn kiểm tra lại do bị mờ.',
    timestamp: '2 giờ trước',
    isRead: false,
    type: 'system',
  },
  {
    id: '2',
    avatar: 'https://i.pravatar.cc/150?img=33',
    author: 'Quản lý Trần',
    content: 'đã duyệt toàn bộ danh sách chỉ số nước tuyến số 12.',
    timestamp: '4 giờ trước',
    isRead: false,
    type: 'update',
  },
  {
    id: '3',
    avatar: 'https://i.pravatar.cc/150?img=68',
    author: 'Nguyễn Văn Tiến',
    content: 'đã thắc mắc về chỉ số nước tháng này tại địa chỉ 621, Trường Chinh.',
    timestamp: 'Hôm qua lúc 15:30',
    isRead: true,
    type: 'mention',
  },
  {
    id: '4',
    avatar: 'https://i.pravatar.cc/150?img=12',
    author: 'Hệ thống bảo trì',
    content: 'thông báo lịch bảo trì máy chủ từ 23:00 đến 01:00 ngày mai.',
    timestamp: 'Thứ 2 lúc 09:00',
    isRead: true,
    type: 'system',
  },
  {
    id: '5',
    avatar: 'https://i.pravatar.cc/150?img=47',
    author: 'Lê Thị Hoa',
    content: 'đã thanh toán thành công hóa đơn tiền nước tháng 9.',
    timestamp: 'Tháng trước',
    isRead: true,
    type: 'update',
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
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
          <Text style={styles.notificationText}>
            <Text style={styles.authorName}>{item.author}</Text> {item.content}
          </Text>
          <Text
            style={[
              styles.timestamp,
              !item.isRead && styles.unreadTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>

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

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  moreIcon: {
    margin: 0,
    alignSelf: 'center',
  },
});
