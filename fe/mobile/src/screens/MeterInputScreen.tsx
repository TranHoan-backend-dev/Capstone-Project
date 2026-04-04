import React from 'react';
import { View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MeterInputForm from '../components/meter-input/MeterInputForm';
import MeterInputHeader from '../components/meter-input/MeterInputHeader';
import styles from '../components/meter-input/meterInput.styles';

const MeterInputScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { 
    customerId: initialCustomerId, 
    customerName: initialCustomerName, 
    address: initialAddress,
    stt: initialStt,
    allCustomerIds = [],
    currentIndex: initialIndex = 0
  } = route.params || {};

  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const handleNext = () => {
    if (currentIndex < allCustomerIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentCustomerId = allCustomerIds.length > 0 ? allCustomerIds[currentIndex] : initialCustomerId;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      <MeterInputHeader onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <MeterInputForm
          key={currentCustomerId} // Force re-mount when customer changes
          customerId={currentCustomerId}
          customerName={currentIndex === initialIndex ? initialCustomerName : undefined}
          address={currentIndex === initialIndex ? initialAddress : undefined}
          stt={currentIndex === initialIndex ? initialStt : (currentIndex + 1)}
          ocrResult={currentIndex === initialIndex ? route.params?.ocrResult : undefined}
          onNext={currentIndex < allCustomerIds.length - 1 ? handleNext : undefined}
          onPrevious={currentIndex > 0 ? handlePrevious : undefined}
        />
      </View>
    </View>
  );
};

export default MeterInputScreen;
