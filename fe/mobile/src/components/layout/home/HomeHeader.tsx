import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Appbar, Avatar, Text, Menu, Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import styles from './home.styles';

export default function HomeHeader() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>();
  const { logout } = useAuth();

  const toggleMenu = () => setVisible(v => !v);

  return (
    <Appbar.Header style={styles.header}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable
            style={styles.userInfo}
            onPress={toggleMenu}
          >
            <Avatar.Image
              size={40}
              source={require('../../../assets/logo.png')}
              style={{ backgroundColor: 'transparent' }}
            />
          </Pressable>
        }
      >
        <Menu.Item
          leadingIcon="account"
          title="Thông tin cá nhân"
          onPress={() => {
            setVisible(false);
            navigation.navigate('Profile');
          }}
        />

        <Menu.Item
          leadingIcon="lock-reset"
          title="Đổi mật khẩu"
          onPress={() => {
            setVisible(false);
            navigation.navigate('ChangePassword');
          }}
        />

        <Divider />

        <Menu.Item
          leadingIcon="logout"
          title="Đăng xuất"
          titleStyle={{ color: '#EF4444' }}
          onPress={async () => {
            setVisible(false);
            await logout();
          }}
        />
      </Menu>

      <Text style={styles.userName}>Nguyễn Thu Trang</Text>

      <Pressable style={styles.notificationBtn} onPress={() => navigation.navigate('Notification')}>
        <IconButton icon="bell-outline" size={24} iconColor="#333" style={{ margin: 0 }} />
        <Text style={styles.notificationText}>Thông báo</Text>
      </Pressable>
    </Appbar.Header>
  );
}
