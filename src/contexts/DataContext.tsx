import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../services/DatabaseService';

// Types
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  available: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  cost: number;
  supplier?: string;
  expiryDate?: string;
  lastUpdated: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: string;
  reservedBy?: string;
  reservedTime?: string;
  location?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  preferences: {
    dietaryRestrictions: string[];
    favoriteItems: string[];
    spiceLevel: 'mild' | 'medium' | 'hot';
  };
  orderHistory: string[];
  createdAt: string;
}

export interface DailyCollection {
  id: string;
  date: string;
  totalAmount: number;
  totalOrders: number;
  paymentMethods: {
    cash: number;
    card: number;
    upi: number;
    other: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DataContextType {
  // Menu Items
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  
  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  
  // Tables
  tables: Table[];
  addTable: (table: Omit<Table, 'id'>) => Promise<void>;
  updateTable: (id: string, updates: Partial<Table>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  
  // Daily Collections
  dailyCollections: DailyCollection[];
  getDailyCollections: () => DailyCollection[];
  updateDailyCollection: (date: string, amount: number, paymentMethod: string) => Promise<void>;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dailyCollections, setDailyCollections] = useState<DailyCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load sample data if database is not available
      await loadSampleData();
      await loadDailyCollections();
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    // Sample menu items
    const sampleMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Butter Chicken',
        price: 320,
        category: 'Main Course',
        description: 'Creamy tomato-based curry with tender chicken',
        available: true,
        preparationTime: 25,
        ingredients: ['chicken', 'tomato', 'cream', 'spices'],
        allergens: ['dairy'],
        nutritionInfo: { calories: 450, protein: 35, carbs: 15, fat: 28 }
      },
      {
        id: '2',
        name: 'Paneer Tikka',
        price: 280,
        category: 'Appetizer',
        description: 'Grilled cottage cheese with aromatic spices',
        available: true,
        preparationTime: 15,
        ingredients: ['paneer', 'yogurt', 'spices'],
        allergens: ['dairy'],
        nutritionInfo: { calories: 320, protein: 18, carbs: 12, fat: 22 }
      },
      {
        id: '3',
        name: 'Biryani',
        price: 350,
        category: 'Main Course',
        description: 'Fragrant basmati rice with spiced meat',
        available: true,
        preparationTime: 35,
        ingredients: ['basmati rice', 'chicken', 'saffron', 'spices'],
        allergens: [],
        nutritionInfo: { calories: 520, protein: 28, carbs: 65, fat: 18 }
      }
    ];

    // Sample inventory
    const sampleInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Basmati Rice',
        quantity: 50,
        unit: 'kg',
        minThreshold: 10,
        maxThreshold: 100,
        cost: 120,
        supplier: 'Local Supplier',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Chicken',
        quantity: 25,
        unit: 'kg',
        minThreshold: 5,
        maxThreshold: 50,
        cost: 280,
        supplier: 'Fresh Meat Co.',
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];

    // Sample tables
    const sampleTables: Table[] = [
      { id: '1', number: 1, capacity: 4, status: 'available', location: 'Main Hall' },
      { id: '2', number: 2, capacity: 2, status: 'occupied', location: 'Main Hall' },
      { id: '3', number: 3, capacity: 6, status: 'available', location: 'Private Room' },
      { id: '4', number: 4, capacity: 4, status: 'cleaning', location: 'Main Hall' }
    ];

    setMenuItems(sampleMenuItems);
    setInventory(sampleInventory);
    setTables(sampleTables);
  };

  const loadDailyCollections = async () => {
    try {
      // Try to load from database first, fallback to local storage
      const collections = await DatabaseService.getDailyCollections();
      if (collections && collections.length > 0) {
        setDailyCollections(collections);
      } else {
        // Load sample daily collections
        const today = new Date().toISOString().split('T')[0];
        const sampleCollections: DailyCollection[] = [
          {
            id: '1',
            date: today,
            totalAmount: 15420,
            totalOrders: 45,
            paymentMethods: { cash: 5420, card: 6000, upi: 4000, other: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setDailyCollections(sampleCollections);
      }
    } catch (error) {
      console.error('Error loading daily collections:', error);
      // Fallback to empty array
      setDailyCollections([]);
    }
  };

  // Menu Items functions
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newItem: MenuItem = {
        ...item,
        id: Date.now().toString()
      };
      setMenuItems(prev => [...prev, newItem]);
    } catch (error) {
      setError('Failed to add menu item');
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      setError('Failed to update menu item');
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      setError('Failed to delete menu item');
      throw error;
    }
  };

  // Inventory functions
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      setInventory(prev => [...prev, newItem]);
    } catch (error) {
      setError('Failed to add inventory item');
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
      ));
    } catch (error) {
      setError('Failed to update inventory item');
      throw error;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      setError('Failed to delete inventory item');
      throw error;
    }
  };

  // Table functions
  const addTable = async (table: Omit<Table, 'id'>) => {
    try {
      const newTable: Table = {
        ...table,
        id: Date.now().toString()
      };
      setTables(prev => [...prev, newTable]);
    } catch (error) {
      setError('Failed to add table');
      throw error;
    }
  };

  const updateTable = async (id: string, updates: Partial<Table>) => {
    try {
      setTables(prev => prev.map(table => 
        table.id === id ? { ...table, ...updates } : table
      ));
    } catch (error) {
      setError('Failed to update table');
      throw error;
    }
  };

  const deleteTable = async (id: string) => {
    try {
      setTables(prev => prev.filter(table => table.id !== id));
    } catch (error) {
      setError('Failed to delete table');
      throw error;
    }
  };

  // Customer functions
  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer: Customer = {
        ...customer,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      setError('Failed to add customer');
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      ));
    } catch (error) {
      setError('Failed to update customer');
      throw error;
    }
  };

  // Daily Collections functions
  const getDailyCollections = () => {
    return dailyCollections;
  };

  const updateDailyCollection = async (date: string, amount: number, paymentMethod: string) => {
    try {
      const existingCollection = dailyCollections.find(c => c.date === date);
      
      if (existingCollection) {
        const updatedCollection = {
          ...existingCollection,
          totalAmount: existingCollection.totalAmount + amount,
          totalOrders: existingCollection.totalOrders + 1,
          paymentMethods: {
            ...existingCollection.paymentMethods,
            [paymentMethod]: (existingCollection.paymentMethods[paymentMethod as keyof typeof existingCollection.paymentMethods] || 0) + amount
          },
          updatedAt: new Date().toISOString()
        };
        
        setDailyCollections(prev => prev.map(c => 
          c.date === date ? updatedCollection : c
        ));
      } else {
        const newCollection: DailyCollection = {
          id: Date.now().toString(),
          date,
          totalAmount: amount,
          totalOrders: 1,
          paymentMethods: {
            cash: paymentMethod === 'cash' ? amount : 0,
            card: paymentMethod === 'card' ? amount : 0,
            upi: paymentMethod === 'upi' ? amount : 0,
            other: paymentMethod === 'other' ? amount : 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setDailyCollections(prev => [...prev, newCollection]);
      }
    } catch (error) {
      setError('Failed to update daily collection');
      throw error;
    }
  };

  const value: DataContextType = {
    // Menu Items
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    
    // Inventory
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    
    // Tables
    tables,
    addTable,
    updateTable,
    deleteTable,
    
    // Customers
    customers,
    addCustomer,
    updateCustomer,
    
    // Daily Collections
    dailyCollections,
    getDailyCollections,
    updateDailyCollection,
    
    // Loading states
    loading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};