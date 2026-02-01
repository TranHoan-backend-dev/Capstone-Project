import React from 'react';
import { View } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';

import { style } from './invoiceStyles';
import InvoiceInfoRow from './InvoiceInfoRow';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { useNavigation } from '@react-navigation/core';

export default function InvoiceCard({ invoice }: any) {
    const navigation = useNavigation<any>();
  return (
    <Card style={style.card}>
      <Card.Content>
        <View style={style.cardHeader}>
          <View style={style.row}>
            <Text style={style.invoiceCode}>{invoice.id}</Text>
          </View>

          <Chip
            icon="cash"
            style={style.collectChip}
            textStyle={style.collectText}
            onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: invoice.id })}
          >
            Thu tiền
          </Chip>
        </View>

        <InvoiceInfoRow icon="account" text={invoice.name} />
        <InvoiceInfoRow icon="map-marker" text={invoice.address} />

        <View style={style.phoneRow}>
          <Text style={style.phoneLabel}>Điện thoại</Text>
          <Text style={style.phoneNumber}>{invoice.phone}</Text>
        </View>

        <View style={style.summaryRow}>
          <Text>
            Tổng số hóa đơn: <Text style={style.bold}>{invoice.totalInvoices}</Text>
          </Text>
          <Text>
            Tổng số tiền:{' '}
            <Text style={[style.bold, style.redText]}>{invoice.totalMoney}</Text>
          </Text>
        </View>

        <InvoiceStatusBadge
          text={invoice.paymentMethod}
          color={invoice.paymentColor}
        />
      </Card.Content>
    </Card>
  );
}
