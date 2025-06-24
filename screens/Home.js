import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  initializeDatabase,
  checkIfMenuExists,
  saveMenuItems,
  getAllMenuItems,
  getMenuCategories,
  filterMenuItems,
} from '../database';
import Banner from '../components/Banner';
import CategoryList from '../components/CategoryList';

const Home = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Initialize app when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      initializeApp();
    }, [])
  );

  // Filter menu items whenever search text or categories change
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      filterMenu();
    }, 500);

    setSearchTimeout(timeout);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchText, selectedCategories]);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Initialize database
      await initializeDatabase();
      
      // Load user data for header
      await loadUserData();
      
      // Load menu data
      await loadMenuData();
      
      // Load categories
      await loadCategories();
      
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to load application data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const firstName = await AsyncStorage.getItem('userFirstName') || '';
      const lastName = await AsyncStorage.getItem('userLastName') || '';
      const avatar = await AsyncStorage.getItem('userAvatar');
      
      setUserName(`${firstName} ${lastName}`.trim());
      setUserAvatar(avatar);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchMenuFromAPI = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu data');
      }
      
      const data = await response.json();
      return data.menu || [];
    } catch (error) {
      console.error('Error fetching menu from API:', error);
      throw error;
    }
  };

  const loadMenuData = async () => {
    try {
      const menuExists = await checkIfMenuExists();
      
      if (menuExists) {
        console.log('Loading menu from database...');
        const menuData = await getAllMenuItems();
        setMenuItems(menuData);
      } else {
        console.log('Fetching menu from API...');
        const menuData = await fetchMenuFromAPI();
        await saveMenuItems(menuData);
        const savedMenuData = await getAllMenuItems();
        setMenuItems(savedMenuData);
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
      Alert.alert('Error', 'Failed to load menu. Please try again.');
    }
  };

  const loadCategories = async () => {
    try {
      const categoryList = await getMenuCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterMenu = async () => {
    try {
      const filteredItems = await filterMenuItems(searchText, selectedCategories);
      setMenuItems(filteredItems);
    } catch (error) {
      console.error('Error filtering menu:', error);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Remove category if already selected
        return prev.filter(cat => cat !== category);
      } else {
        // Add category if not selected
        return [...prev, category];
      }
    });
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const getImageUrl = (imageFileName) => {
    return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`;
  };

  const getUserInitials = () => {
    const names = userName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return userName.charAt(0).toUpperCase();
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Image
          source={{ uri: getImageUrl(item.image) }}
          style={styles.menuItemImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#495E57" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/LargeLittleLemonLogo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.avatarContainer} onPress={navigateToProfile}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getUserInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Banner Component */}
            <Banner
              searchText={searchText}
              onSearchChange={handleSearchChange}
            />
            
            {/* Category List Component */}
            <CategoryList
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
          </>
        }
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id ? item.id.toString() : item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#495E57',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 40,
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingBottom: 15,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    marginRight: 15,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 20,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default Home;