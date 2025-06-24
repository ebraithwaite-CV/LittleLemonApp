import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Banner = ({ searchText, onSearchChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Little Lemon</Text>
      <Text style={styles.subtitle}>Chicago</Text>
      
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={{ 
            uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/heroImage.jpg?raw=true' 
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#495E57" 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for dishes..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#495E57',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F4CE14',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 26,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  textContent: {
    flex: 1,
    marginRight: 15,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    fontWeight: '400',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
});

export default Banner;