import React from 'react';
import { View, Image, Modal } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

export default function ImagePreviewModal({
  visible,
  imageUri,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Hình ảnh định kiểm</Text>
            <Button
              mode="text"
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#E53935" />
            </Button>
          </View>

          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Icon name="image-off" size={48} color="#ccc" />
              <Text style={styles.noImageText}>Chưa có hình ảnh</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
