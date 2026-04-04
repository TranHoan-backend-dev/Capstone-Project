import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import AppHeader from '../ui/AppHeader';

interface ScreenLayoutProps {
  title: string;
  showBackButton?: boolean;
  headerBackgroundColor?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  rightContent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  statusBarColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
}

/**
 * ScreenLayout is a reusable layout component for screen components.
 * It handles SafeAreaView, StatusBar, Header, ScrollView, and Footer.
 */
const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  showBackButton = true,
  headerBackgroundColor,
  rightContent,
  children,
  footer,
  containerStyle,
  contentContainerStyle,
  scrollable = true,
  statusBarColor = '#1E88E5',
  statusBarStyle = 'light-content',
}) => {
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
      
      <AppHeader 
        title={title} 
        showBackButton={showBackButton} 
        backgroundColor={headerBackgroundColor}
        rightContent={rightContent}
      />
      
      {scrollable ? (
        <ScrollView 
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>
          {children}
        </View>
      )}
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Default background color
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

export default ScreenLayout;
