import * as SQLite from 'expo-sqlite';

let db = null;

export const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('little_lemon.db');
    await createMenuTable();
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const createMenuTable = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        category TEXT
      );
    `);
  } catch (error) {
    console.error('Error creating menu table:', error);
    throw error;
  }
};

export const checkIfMenuExists = async () => {
  try {
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM menu;');
    return result.count > 0;
  } catch (error) {
    console.error('Error checking menu existence:', error);
    return false;
  }
};

export const saveMenuItems = async (menuData) => {
  try {
    // Clear existing data
    await db.execAsync('DELETE FROM menu;');
    
    // Insert new data
    for (const item of menuData) {
      await db.runAsync(
        'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
        [
          item.name,
          item.price,
          item.description,
          item.image,
          item.category || 'main'
        ]
      );
    }
  } catch (error) {
    console.error('Error saving menu items:', error);
    throw error;
  }
};

export const getAllMenuItems = async () => {
  try {
    const allRows = await db.getAllAsync('SELECT * FROM menu ORDER BY name;');
    return allRows;
  } catch (error) {
    console.error('Error loading menu items:', error);
    throw error;
  }
};

export const getMenuCategories = async () => {
  try {
    const categories = await db.getAllAsync('SELECT DISTINCT category FROM menu WHERE category IS NOT NULL ORDER BY category;');
    return categories.map(row => row.category);
  } catch (error) {
    console.error('Error loading menu categories:', error);
    return [];
  }
};

export const filterMenuItems = async (searchText = '', selectedCategories = []) => {
  try {
    let query = 'SELECT * FROM menu WHERE 1=1';
    let params = [];
    
    // Add search text filter
    if (searchText && searchText.trim() !== '') {
      query += ' AND name LIKE ?';
      params.push(`%${searchText.trim()}%`);
    }
    
    // Add category filter
    if (selectedCategories.length > 0) {
      const placeholders = selectedCategories.map(() => '?').join(',');
      query += ` AND category IN (${placeholders})`;
      params.push(...selectedCategories);
    }
    
    query += ' ORDER BY name';
    
    const results = await db.getAllAsync(query, params);
    return results;
  } catch (error) {
    console.error('Error filtering menu items:', error);
    throw error;
  }
};