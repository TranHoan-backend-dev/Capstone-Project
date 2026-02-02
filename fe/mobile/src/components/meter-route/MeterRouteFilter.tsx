import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Menu } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterRoute.styles';

interface Props {
  period: {
    ky: string;
    nam: string;
    dot: string;
  };
  onChange: (p: Props['period']) => void;
}

export default function MeterRouteFilter({ period, onChange }: Props) {
  const [kyVisible, setKyVisible] = useState(false);
  const [namVisible, setNamVisible] = useState(false);
  const [dotVisible, setDotVisible] = useState(false);

  const renderSelect = (
    label: string,
    value: string,
    visible: boolean,
    setVisible: any,
    options: string[],
    onSelect: (v: string) => void
  ) => (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable
            onPress={() => setVisible(true)}
            style={styles.filterButtonMenu}
          >
            <Text style={styles.filterButtonText}>{value}</Text>
            <MaterialCommunityIcons
              name={visible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#1E88E5"
            />
          </Pressable>
        }
      >
        {options.map(v => (
          <Menu.Item
            key={v}
            onPress={() => {
              setVisible(false);
              onSelect(v);
            }}
            title={
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>{v}</Text>
                {value === v && (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color="#4CAF50"
                  />
                )}
              </View>
            }
            style={styles.menuItem}
          />
        ))}
      </Menu>
    </View>
  );

  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
        {renderSelect(
          'Kỳ',
          period.ky,
          kyVisible,
          setKyVisible,
          ['01','02','03','04','05','06','07','08','09','10','11','12'],
          ky => onChange({ ...period, ky })
        )}

        {renderSelect(
          'Năm',
          period.nam,
          namVisible,
          setNamVisible,
          ['2024','2025','2026'],
          nam => onChange({ ...period, nam })
        )}

        {renderSelect(
          'Đợt',
          period.dot,
          dotVisible,
          setDotVisible,
          ['01','02','03','04'],
          dot => onChange({ ...period, dot })
        )}
      </View>
    </View>
  );
}
