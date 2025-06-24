import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CategoryList = ({ categories, selectedCategories, onCategoryToggle }) => {
  const handleCategoryPress = (category) => {
    onCategoryToggle(category);
  };

  const renderCategory = (category) => {
    const isSelected = selectedCategories.includes(category);
    
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryButton,
          isSelected && styles.selectedCategoryButton
        ]}
        onPress={() => handleCategoryPress(category)}
      >
        <Text style={[
          styles.categoryText,
          isSelected && styles.selectedCategoryText
        ]}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ORDER FOR DELIVERY!</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {categories.map(renderCategory)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingLeft: 20,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryButton: {
    backgroundColor: '#495E57',
    borderColor: '#495E57',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495E57',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
});

export default CategoryList;