import { ToastAndroid, Platform } from 'react-native';

// Chúng ta có thể dùng ToastAndroid (mặc định của Android) 
// hoặc có thể mở rộng sau này cho iOS
export const showToast = {
  success: (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log('Success:', message);
      // Fallback cho iOS nếu không dùng library là Alert hoặc Custom Modal
    }
  },
  error: (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      console.error('Error:', message);
    }
  },
  info: (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log('Info:', message);
    }
  },
};
