import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const onDismiss = () => setVisible(false);

  const show = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
  }, []);

  const success = useCallback((msg: string) => show(msg, 'success'), [show]);
  const error = useCallback((msg: string) => show(msg, 'error'), [show]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#333333';
    }
  };

  return (
    <ToastContext.Provider value={{ show, success, error }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={3000}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {message}
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
