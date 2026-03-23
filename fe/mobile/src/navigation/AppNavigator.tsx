import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MeterScreen from '../screens/MeterScreen';
import MeterRouteScreen from '../screens/MeterRouteScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import MeterInputScreen from '../screens/MeterInputScreen';
import DebtScreen from '../screens/DebtScreen';
import CollectionScreen from '../screens/CollectionScreen';
import InvoiceListScreen from '../screens/InvoiceListScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CaptureWaterMeterScreen from '../screens/CaptureWaterMeterScreen';
import VerifyMeterReadingsScreen from '../screens/VerifyMeterReadingsScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Meter: undefined;
  Debt: undefined;
  Collection: undefined;
  MeterRoute: undefined;
  CustomerList: undefined;
  MeterInput: {
    customerId?: string;
    customerName?: string;
    address?: string;
  };
  InvoiceList: undefined;
  InvoiceDetail: {
    customerId: string;
    customerName: string;
    address: string;
    phone?: string;
  };
  ForgotPassword: undefined;
  Profile: undefined;
  ChangePassword: undefined;
  Notification: undefined;
  CaptureWaterMeter: {
    customerId?: string;
    customerName?: string;
    address?: string;
  };
  VerifyMeterReadings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Meter" component={MeterScreen} />
            <Stack.Screen name="MeterRoute" component={MeterRouteScreen} />
            <Stack.Screen name="CustomerList" component={CustomerListScreen} />
            <Stack.Screen name="MeterInput" component={MeterInputScreen} />
            <Stack.Screen name="Debt" component={DebtScreen} />
            <Stack.Screen name="Collection" component={CollectionScreen} />
            <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
            <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="CaptureWaterMeter" component={CaptureWaterMeterScreen} />
            <Stack.Screen name="VerifyMeterReadings" component={VerifyMeterReadingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
