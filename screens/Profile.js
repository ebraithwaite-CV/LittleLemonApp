import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const Profile = ({ navigation, onLogout }) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: null,
    notifications: {
      orderStatuses: true,
      passwordChanges: true,
      specialOffers: true,
      newsletter: true,
    },
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const firstName = await AsyncStorage.getItem('userFirstName') || '';
      const lastName = await AsyncStorage.getItem('userLastName') || '';
      const email = await AsyncStorage.getItem('userEmail') || '';
      const phoneNumber = await AsyncStorage.getItem('userPhoneNumber') || '';
      const avatar = await AsyncStorage.getItem('userAvatar');
      
      // Load notification preferences
      const orderStatuses = await AsyncStorage.getItem('notif_orderStatuses');
      const passwordChanges = await AsyncStorage.getItem('notif_passwordChanges');
      const specialOffers = await AsyncStorage.getItem('notif_specialOffers');
      const newsletter = await AsyncStorage.getItem('notif_newsletter');

      setProfileData({
        firstName,
        lastName,
        email,
        phoneNumber,
        avatar,
        notifications: {
          orderStatuses: orderStatuses !== 'false',
          passwordChanges: passwordChanges !== 'false',
          specialOffers: specialOffers !== 'false',
          newsletter: newsletter !== 'false',
        },
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const updateField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const updateNotification = (notifType, value) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notifType]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    
    if (match) {
      let formatted = '';
      if (match[1]) formatted += `(${match[1]}`;
      if (match[2]) formatted += `) ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      return formatted;
    }
    
    return text;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    updateField('phoneNumber', formatted);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateField('avatar', result.assets[0].uri);
    }
  };

  const removeImage = () => {
    updateField('avatar', null);
  };

  const saveChanges = async () => {
    try {
      await AsyncStorage.setItem('userFirstName', profileData.firstName);
      await AsyncStorage.setItem('userLastName', profileData.lastName);
      await AsyncStorage.setItem('userEmail', profileData.email);
      await AsyncStorage.setItem('userPhoneNumber', profileData.phoneNumber);
      
      if (profileData.avatar) {
        await AsyncStorage.setItem('userAvatar', profileData.avatar);
      } else {
        await AsyncStorage.removeItem('userAvatar');
      }

      // Save notification preferences
      await AsyncStorage.setItem('notif_orderStatuses', profileData.notifications.orderStatuses.toString());
      await AsyncStorage.setItem('notif_passwordChanges', profileData.notifications.passwordChanges.toString());
      await AsyncStorage.setItem('notif_specialOffers', profileData.notifications.specialOffers.toString());
      await AsyncStorage.setItem('notif_newsletter', profileData.notifications.newsletter.toString());

      setHasUnsavedChanges(false);
      Alert.alert('Success', 'Your changes have been saved!');
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  const discardChanges = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => {
            loadProfileData();
            setHasUnsavedChanges(false);
          }
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              if (onLogout) {
                onLogout();
              }
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const getInitials = () => {
    const firstInitial = profileData.firstName.charAt(0).toUpperCase();
    const lastInitial = profileData.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const CheckBox = ({ checked, onToggle, label }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#495E57" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal information</Text>
          
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Text style={styles.fieldLabel}>Avatar</Text>
            <View style={styles.avatarContainer}>
              {profileData.avatar ? (
                <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
              )}
              <View style={styles.avatarButtons}>
                <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
                  <Text style={styles.avatarButtonText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.avatarButton, styles.avatarButtonSecondary]} 
                  onPress={removeImage}
                >
                  <Text style={styles.avatarButtonTextSecondary}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>First name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Last name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
              placeholder="Enter your last name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone number</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.phoneNumber}
              onChangeText={handlePhoneChange}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>
        </View>

        {/* Email Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email notifications</Text>
          
          <CheckBox
            checked={profileData.notifications.orderStatuses}
            onToggle={(value) => updateNotification('orderStatuses', !profileData.notifications.orderStatuses)}
            label="Order statuses"
          />
          
          <CheckBox
            checked={profileData.notifications.passwordChanges}
            onToggle={(value) => updateNotification('passwordChanges', !profileData.notifications.passwordChanges)}
            label="Password changes"
          />
          
          <CheckBox
            checked={profileData.notifications.specialOffers}
            onToggle={(value) => updateNotification('specialOffers', !profileData.notifications.specialOffers)}
            label="Special offers"
          />
          
          <CheckBox
            checked={profileData.notifications.newsletter}
            onToggle={(value) => updateNotification('newsletter', !profileData.notifications.newsletter)}
            label="Newsletter"
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.discardButton} 
            onPress={discardChanges}
            disabled={!hasUnsavedChanges}
          >
            <Text style={[
              styles.discardButtonText,
              !hasUnsavedChanges && styles.disabledButtonText
            ]}>
              Discard changes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.saveButton, !hasUnsavedChanges && styles.disabledButton]} 
            onPress={saveChanges}
            disabled={!hasUnsavedChanges}
          >
            <Text style={[
              styles.saveButtonText,
              !hasUnsavedChanges && styles.disabledButtonText
            ]}>
              Save changes
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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#495E57',
  },
  headerSpacer: {
    width: 34,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495E57',
    marginBottom: 20,
  },
  avatarSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  avatarButton: {
    backgroundColor: '#495E57',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  avatarButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#495E57',
  },
  avatarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  avatarButtonTextSecondary: {
    color: '#495E57',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#495E57',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#495E57',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#F4CE14',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495E57',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  discardButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#495E57',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495E57',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#495E57',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default Profile;