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

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Meter: undefined;
  Debt: undefined;
  Collection: undefined;
  MeterRoute: undefined;
  CustomerList: undefined;
  MeterInput: {
    customerId: string;
    customerName: string;
    address: string;
  };
  InvoiceList: undefined;
  InvoiceDetail: {
    customerId: string;
    customerName: string;
    address: string;
    phone?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Meter" component={MeterScreen} />
        <Stack.Screen name="MeterRoute" component={MeterRouteScreen} />
        <Stack.Screen name="CustomerList" component={CustomerListScreen} />
        <Stack.Screen name="MeterInput" component={MeterInputScreen} />
        <Stack.Screen name="Debt" component={DebtScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
        <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
        <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
