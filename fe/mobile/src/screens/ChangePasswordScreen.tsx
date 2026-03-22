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
import authService from '../services/auth.service';
import { useNavigation } from '@react-navigation/core';
import { showToast } from '../utils/toast';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      showToast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast.success('Mật khẩu đã được thay đổi thành công');
      navigation.goBack();
    } catch (error: any) {
      console.error('Change password error:', error);
      // apiFetch đã hiển thị toast rồi
    } finally {
      setIsSaving(false);
    }
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
                    disabled={isSaving}
                  >
                    Hủy
                  </Button>

                  <Button
                    mode="contained"
                    style={styles.saveButton}
                    labelStyle={styles.saveButtonLabel}
                    buttonColor="#2563EB"
                    onPress={handleSave}
                    loading={isSaving}
                    disabled={
                      isSaving ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      !hasMinLength ||
                      !hasUpperCase ||
                      !hasNumber
                    }
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
