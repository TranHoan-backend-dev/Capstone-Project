import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Appbar, Avatar, Text, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from './home.styles';

export default function HomeHeader() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<any>();

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
              source={require('../../assets/logo.png')}
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
          onPress={() => {
            setVisible(false);
            console.log('Logout');
          }}
        />
      </Menu>

      <Text style={styles.userName}>Nguyễn Dũng</Text>
      <Appbar.Action icon="bell-outline" color="#fff" />
    </Appbar.Header>
  );
}
