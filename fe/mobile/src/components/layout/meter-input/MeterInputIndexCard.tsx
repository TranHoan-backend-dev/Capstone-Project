import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MeterInputIndexCardProps {
  oldIndex: string;
  newIndex: string;
  m3: string;
  onNewIndexChange: (value: string) => void;
}

const formatCurrency = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function MeterInputIndexCard({
  oldIndex,
  newIndex,
  m3,
  onNewIndexChange,
}: MeterInputIndexCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Icon name="water-pump" size={20} color="#1E88E5" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Chỉ số tiêu thụ</Text>
        </View>

        <View style={styles.indexRow}>
          <View style={styles.indexColumn}>
            <View style={styles.labelContainer}>
              <Icon name="numeric-off" size={16} color="#999" style={styles.labelIcon} />
              <Text style={styles.indexLabel}>Chỉ số cũ</Text>
            </View>
            <TextInput
              mode="outlined"
              value={oldIndex}
              editable={false}
              style={styles.indexInput}
              outlineColor="#E0E0E0"
              textColor="#999"
              theme={{ colors: { background: '#fff' } }}
              contentStyle={styles.inputContentTextDisabled}
            />
          </View>
          <View style={styles.indexColumn}>
             <View style={styles.labelContainer}>
              <Icon name="numeric-positive-1" size={18} color="#1E88E5" style={styles.labelIcon} />
              <Text style={styles.indexLabel}>Chỉ số mới</Text>
            </View>
            <TextInput
              mode="outlined"
              value={newIndex}
              onChangeText={onNewIndexChange}
              keyboardType="numeric"
              style={styles.indexInput}
              outlineColor="#1E88E5"
              activeOutlineColor="#1E88E5"
              theme={{ colors: { background: '#fff' } }}
              contentStyle={styles.inputContentTextActive}
              right={<TextInput.Icon icon="microphone" color="#333" />}
            />
          </View>
        </View>

        <View style={styles.resultRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>M3:</Text>
            <Text style={[styles.resultValue, styles.blueText]}>{m3}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Số tiền:</Text>
            <Text style={[styles.resultValue, styles.redText]}>
              {formatCurrency(parseInt(m3 || '0', 10) * 9890)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 4,
  },
  indexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  indexColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  indexLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  indexInput: {
    height: 48,
    backgroundColor: '#fff',
  },
  inputContentTextDisabled: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  inputContentTextActive: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 15,
    color: '#333',
    marginRight: 8,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  blueText: {
    color: '#1E88E5',
  },
  redText: {
    color: '#EF4444',
  },
});

