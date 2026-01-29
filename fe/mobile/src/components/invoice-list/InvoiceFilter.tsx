import React, { useState } from 'react';
import { View, Modal, Pressable, FlatList, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { style } from './invoiceStyles';

const STATUS_OPTIONS = [
  'Tất cả',
  'Chưa thu',
  'Đã thu',
  'Hoá đơn tờn',
];

export default function InvoiceFilter({ value, onChange }: any) {
  const [visible, setVisible] = useState(false);

  const renderOption = (item: string) => (
    <Pressable
      onPress={() => {
        onChange(item);
        setVisible(false);
      }}
      style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 14, color: '#333' }}>{item}</Text>
        {value === item && (
          <Text style={{ fontSize: 16, color: '#1E88E5', fontWeight: 'bold' }}>✓</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={style.sectionLabel}>Tình trạng</Text>

      <Button
        mode="outlined"
        icon="chevron-down"
        onPress={() => setVisible(true)}
        style={style.filterButton}
        contentStyle={style.filterButtonContent}
      >
        {value}
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: '#fff',
              marginTop: '25%',
              marginHorizontal: 16,
              borderRadius: 8,
              maxHeight: 300,
              paddingVertical: 8,
            }}
            onPress={() => {}}
          >
            <FlatList
              data={STATUS_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderOption(item)}
              scrollEnabled={true}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
