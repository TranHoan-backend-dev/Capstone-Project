import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Surface, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../components/change-password/styles';
import PasswordInput from '../components/change-password/PasswordInput';
import PasswordRequirements from '../components/change-password/PasswordRequirements';
import { useNavigation } from '@react-navigation/core';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = () => {
    console.log('Change password');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <IconButton icon="arrow-left" size={20} iconColor="#2563EB" />
                <Text style={styles.backText}>Quay lại</Text>
              </TouchableOpacity>

              <View style={styles.titleSection}>
                <Text style={styles.title}>Đổi mật khẩu</Text>
                <Text style={styles.subtitle}>
                  Cập nhật mật khẩu của bạn để đảm bảo an toàn
                </Text>
              </View>

              <Surface style={styles.card}>
                <PasswordInput
                  placeholder="Nhập mật khẩu hiện tại"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />

                <PasswordInput
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />

                <PasswordInput
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <PasswordRequirements
                  hasMinLength={hasMinLength}
                  hasUpperCase={hasUpperCase}
                  hasNumber={hasNumber}
                  hasSpecialChar={hasSpecialChar}
                />

                <View style={styles.actionsContainer}>
                  <Button
                    mode="outlined"
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonLabel}
                    onPress={handleCancel}
                  >
                    Hủy
                  </Button>

                  <Button
                    mode="contained"
                    style={styles.saveButton}
                    labelStyle={styles.saveButtonLabel}
                    buttonColor="#2563EB"
                    disabled={
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      !hasMinLength ||
                      !hasUpperCase ||
                      !hasNumber
                    }
                    onPress={handleSave}
                  >
                    Lưu thay đổi
                  </Button>
                </View>
              </Surface>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
