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
      const collections = await dbService.getDailyCollections();
      if (collections && collections.length > 0) {
        // Map database format to interface format
        const mappedCollections = collections.map((col: any) => ({
          id: col.id,
          date: col.date,
          totalAmount: col.total_amount,
          totalOrders: col.total_orders,
          paymentMethods: col.payment_methods || { cash: 0, card: 0, upi: 0, other: 0 },
          createdAt: col.created_at,
          updatedAt: col.updated_at
        }));
        setDailyCollections(mappedCollections);
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
      // Try to save to database first
      const dbItem = await dbService.createMenuItem({
        name: item.name,
        description: item.description || '',
        category: item.category,
        price: item.price,
        cost_price: 0,
        image_url: item.photo || '',
        is_available: item.available,
        is_special: item.isSpecial || false,
        preparation_time: item.preparationTime || 15,
        calories: item.nutritionInfo?.calories || 0,
        allergens: item.allergens || [],
        dietary_info: []
      });

      if (dbItem) {
        // Map database item to interface format
        const newItem: MenuItem = {
          id: dbItem.id,
          name: dbItem.name,
          price: dbItem.price,
          category: dbItem.category,
          description: dbItem.description || '',
          photo: dbItem.image_url || '',
          available: dbItem.is_available,
          isSpecial: dbItem.is_special,
          preparationTime: dbItem.preparation_time || 15,
          ingredients: [],
          allergens: dbItem.allergens || [],
          nutritionInfo: { calories: dbItem.calories || 0, protein: 0, carbs: 0, fat: 0 }
        };
        setMenuItems(prev => [...prev, newItem]);
      } else {
        // Fallback to local storage
        const newItem: MenuItem = {
          ...item,
          id: Date.now().toString()
        };
        setMenuItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error adding menu item to database:', error);
      // Fallback to local storage
      const newItem: MenuItem = {
        ...item,
        id: Date.now().toString()
      };
      setMenuItems(prev => [...prev, newItem]);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      // Try to update in database first
      const dbUpdates = {
        name: updates.name,
        description: updates.description,
        category: updates.category,
        price: updates.price,
        image_url: updates.photo,
        is_available: updates.available,
        is_special: updates.isSpecial,
        preparation_time: updates.preparationTime,
        calories: updates.nutritionInfo?.calories,
        allergens: updates.allergens
      };

      const updatedItem = await dbService.updateMenuItem(id, dbUpdates);
      
      if (updatedItem) {
        // Map database item to interface format
        const mappedUpdates = {
          name: updatedItem.name,
          price: updatedItem.price,
          category: updatedItem.category,
          description: updatedItem.description || '',
          photo: updatedItem.image_url || '',
          available: updatedItem.is_available,
          isSpecial: updatedItem.is_special,
          preparationTime: updatedItem.preparation_time || 15,
          allergens: updatedItem.allergens || [],
          nutritionInfo: { calories: updatedItem.calories || 0, protein: 0, carbs: 0, fat: 0 }
        };
        setMenuItems(prev => prev.map(item => 
          item.id === id ? { ...item, ...mappedUpdates } : item
        ));
      } else {
        // Fallback to local update
        setMenuItems(prev => prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ));
      }
    } catch (error) {
      console.error('Error updating menu item in database:', error);
      // Fallback to local update
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      // Try to delete from database first
      const success = await dbService.deleteMenuItem(id);
      
      if (success) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
      } else {
        // Fallback to local deletion
        setMenuItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting menu item from database:', error);
      // Fallback to local deletion
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Inventory functions
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      // Try to save to database first
      const dbItem = await dbService.createInventoryItem({
        name: item.name,
        category: item.category || '',
        unit: item.unit,
        current_stock: item.quantity,
        minimum_stock: item.minThreshold,
        maximum_stock: item.maxThreshold,
        cost_per_unit: item.cost,
        supplier: item.supplier,
        expiry_date: item.expiryDate
      });

      if (dbItem) {
        // Map database item to interface format
        const newItem: InventoryItem = {
          id: dbItem.id,
          name: dbItem.name,
          quantity: dbItem.current_stock,
          unit: dbItem.unit,
          minThreshold: dbItem.minimum_stock,
          maxThreshold: dbItem.maximum_stock || 100,
          cost: dbItem.cost_per_unit || 0,
          supplier: dbItem.supplier || '',
          expiryDate: dbItem.expiry_date,
          lastUpdated: dbItem.updated_at
        };
        setInventory(prev => [...prev, newItem]);
      } else {
        // Fallback to local storage
        const newItem: InventoryItem = {
          ...item,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString()
        };
        setInventory(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error adding inventory item to database:', error);
      // Fallback to local storage
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      setInventory(prev => [...prev, newItem]);
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      // Try to update in database first
      const dbUpdates = {
        name: updates.name,
        category: updates.category,
        unit: updates.unit,
        current_stock: updates.quantity,
        minimum_stock: updates.minThreshold,
        maximum_stock: updates.maxThreshold,
        cost_per_unit: updates.cost,
        supplier: updates.supplier,
        expiry_date: updates.expiryDate
      };

      const updatedItem = await dbService.updateInventoryItem(id, dbUpdates);
      
      if (updatedItem) {
        // Map database item to interface format
        const mappedUpdates = {
          name: updatedItem.name,
          quantity: updatedItem.current_stock,
          unit: updatedItem.unit,
          minThreshold: updatedItem.minimum_stock,
          maxThreshold: updatedItem.maximum_stock || 100,
          cost: updatedItem.cost_per_unit || 0,
          supplier: updatedItem.supplier || '',
          expiryDate: updatedItem.expiry_date,
          lastUpdated: updatedItem.updated_at
        };
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, ...mappedUpdates } : item
        ));
      } else {
        // Fallback to local update
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
        ));
      }
    } catch (error) {
      console.error('Error updating inventory item in database:', error);
      // Fallback to local update
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
      ));
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      // Try to delete from database first
      const success = await dbService.deleteInventoryItem(id);
      
      if (success) {
        setInventory(prev => prev.filter(item => item.id !== id));
      } else {
        // Fallback to local deletion
        setInventory(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting inventory item from database:', error);
      // Fallback to local deletion
      setInventory(prev => prev.filter(item => item.id !== id));
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