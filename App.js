import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
  });

  useEffect(() => {
    // Check if onboarding is completed when app loads
    const checkOnboardingStatus = async () => {
      try {
        const isCompleted = await AsyncStorage.getItem('isOnboardingCompleted');
        setState({
          isLoading: false,
          isOnboardingCompleted: isCompleted === 'true',
        });
      } catch (error) {
        console.error('Error reading onboarding status:', error);
        setState({
          isLoading: false,
          isOnboardingCompleted: false,
        });
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setState(prevState => ({
      ...prevState,
      isOnboardingCompleted: true,
    }));
  };

  const handleLogout = () => {
    setState({
      isLoading: false,
      isOnboardingCompleted: false,
    });
  };

  if (state.isLoading) {
    // Show splash screen while loading
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the navigation header
        }}
      >
        {state.isOnboardingCompleted ? (
          // User has completed onboarding, show main app screens
          <>
            <Stack.Screen name="Home">
              {props => (
                <Home 
                  {...props} 
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {props => (
                <Profile 
                  {...props} 
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          // User hasn't completed onboarding, show onboarding screen
          <Stack.Screen name="Onboarding">
            {props => (
              <Onboarding 
                {...props} 
                onComplete={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}