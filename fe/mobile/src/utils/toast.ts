import { ToastAndroid, Platform } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

// Global listener for functional/static code to trigger UI Toasts
let globalToastListener: ((message: string, type: ToastType) => void) | null = null;

export const setGlobalToastListener = (listener: (message: string, type: ToastType) => void) => {
  globalToastListener = listener;
};

export const showToast = {
  success: (message: string) => {
    if (globalToastListener) {
      globalToastListener(message, 'success');
    } else if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log('Success:', message);
    }
  },
  error: (message: string) => {
    if (globalToastListener) {
      globalToastListener(message, 'error');
    } else if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      console.error('Error:', message);
    }
  },
  info: (message: string) => {
    if (globalToastListener) {
      globalToastListener(message, 'info');
    } else if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log('Info:', message);
    }
  },
};
