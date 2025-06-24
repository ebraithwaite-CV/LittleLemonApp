import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LittleLemonSplashLogo from '../assets/LittleLemonSplashLogo.png';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={LittleLemonSplashLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>LITTLE LEMON</Text>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#495E57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4CE14',
    letterSpacing: 2,
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});

export default SplashScreen;