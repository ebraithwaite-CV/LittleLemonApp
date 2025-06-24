import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LargeLittleLemonLogo from '../assets/LargeLittleLemonLogo.jpg';

const Onboarding = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // Validation functions
  const isValidFirstName = (name) => {
    // Check if name is not empty and contains only alphabetic characters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    return name.trim().length > 0 && nameRegex.test(name.trim());
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Check if form is valid
  const isFormValid = isValidFirstName(firstName) && isValidEmail(email);

  const handleNext = async () => {
    if (isFormValid) {
      try {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userFirstName', firstName.trim());
        await AsyncStorage.setItem('userEmail', email.trim());
        await AsyncStorage.setItem('isOnboardingCompleted', 'true');
        
        // Call the onComplete callback to update the app state
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error('Error saving onboarding data:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={LargeLittleLemonLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Let us get to know you</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* First Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={[
                styles.textInput,
                !isValidFirstName(firstName) && firstName.length > 0 && styles.invalidInput
              ]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[
                styles.textInput,
                !isValidEmail(email) && email.length > 0 && styles.invalidInput
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !isFormValid && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <Text style={[
              styles.buttonText,
              !isFormValid && styles.disabledButtonText
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 80,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#495E57',
    textAlign: 'center',
    marginBottom: 10,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495E57',
    marginBottom: 8,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  invalidInput: {
    borderColor: '#FF6B6B',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 40,
  },
  nextButton: {
    backgroundColor: '#495E57',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999999',
  },
});

export default Onboarding;