import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Types
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  available: boolean;
  is_special?: boolean;
  preparation_time?: number;
  allergens?: string[];
  dietary_info?: string[];
  nutrition_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  created_by?: string;
  created_at?: string;
  updated_at?: string;
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
  const { user } = useAuth();
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
      await loadMenuItems();
      await loadSampleData(); // For other data
      await loadDailyCollections();
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    if (!supabase) {
      // Load sample menu items for demo
      await loadSampleMenuItems();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          description,
          category,
          price,
          cost_price,
          image_url,
          is_available,
          is_special,
          preparation_time,
          calories,
          allergens,
          dietary_info,
          created_by,
          created_at,
          updated_at
        `)
        .order('category', { ascending: true });

      if (error) throw error;
      
      const formattedItems = data?.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        image_url: item.image_url,
        available: item.is_available,
        is_special: item.is_special,
        preparation_time: item.preparation_time,
        allergens: item.allergens || [],
        dietary_info: item.dietary_info || [],
        nutrition_info: item.calories ? {
          calories: item.calories,
          protein: 0,
          carbs: 0,
          fat: 0
        } : undefined,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setMenuItems(formattedItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
      // Fallback to sample data
      await loadSampleMenuItems();
    }
  };

  const loadSampleMenuItems = async () => {
    const sampleMenuItems: MenuItem[] = [
      {
        id: '1',
        name: 'Butter Chicken',
        price: 320,
        category: 'Main Course',
        description: 'Creamy tomato-based curry with tender chicken',
        available: true,
        is_special: false,
        preparation_time: 25,
        allergens: ['dairy']
      },
      {
        id: '2',
        name: 'Paneer Tikka',
        price: 280,
        category: 'Appetizer',
        description: 'Grilled cottage cheese with aromatic spices',
        available: true,
        is_special: true,
        preparation_time: 15,
        allergens: ['dairy']
      }
    ];
    setMenuItems(sampleMenuItems);
  };

  const loadSampleData = async () => {
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

    setInventory(sampleInventory);
    setTables(sampleTables);
  };

  const loadDailyCollections = async () => {
    try {
      if (!supabase) {
        // Load sample daily collections for demo
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
        return;
      }

      const { data, error } = await supabase
        .from('daily_collections')
        .select(`
          id,
          date,
          total_amount,
          total_orders,
          payment_methods,
          bills_generated,
          created_at,
          updated_at
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedCollections = data.map(item => ({
          id: item.id,
          date: item.date,
          totalAmount: item.total_amount,
          totalOrders: item.total_orders,
          paymentMethods: item.payment_methods || { cash: 0, card: 0, upi: 0, other: 0 },
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        setDailyCollections(formattedCollections);
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
      if (!supabase) {
        // Demo mode
        const newItem: MenuItem = {
          ...item,
          id: Date.now().toString()
        };
        setMenuItems(prev => [...prev, newItem]);
        return;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          image_url: item.image_url,
          is_available: item.available,
          is_special: item.is_special || false,
          preparation_time: item.preparation_time || 15,
          allergens: item.allergens || [],
          dietary_info: item.dietary_info || [],
          calories: item.nutrition_info?.calories,
          created_by: user?.id
        })
        .select(`
          id,
          name,
          description,
          category,
          price,
          cost_price,
          image_url,
          is_available,
          is_special,
          preparation_time,
          calories,
          allergens,
          dietary_info,
          created_by,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      
      const formattedItem: MenuItem = {
        id: data.id,
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        image_url: data.image_url,
        available: data.is_available,
        is_special: data.is_special,
        preparation_time: data.preparation_time,
        allergens: data.allergens || [],
        dietary_info: data.dietary_info || [],
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setMenuItems(prev => [...prev, formattedItem]);
    } catch (error) {
      setError('Failed to add menu item');
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      if (!supabase) {
        // Demo mode
        setMenuItems(prev => prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ));
        return;
      }

      const { data, error } = await supabase
        .from('menu_items')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          price: updates.price,
          image_url: updates.image_url,
          is_available: updates.available,
          is_special: updates.is_special,
          preparation_time: updates.preparation_time,
          allergens: updates.allergens,
          dietary_info: updates.dietary_info,
          calories: updates.nutrition_info?.calories
        })
        .eq('id', id)
        .select(`
          id,
          name,
          description,
          category,
          price,
          cost_price,
          image_url,
          is_available,
          is_special,
          preparation_time,
          calories,
          allergens,
          dietary_info,
          created_by,
          created_at,
          updated_at
        `)
        .single();

      if (error) throw error;
      
      const formattedItem: MenuItem = {
        id: data.id,
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        image_url: data.image_url,
        available: data.is_available,
        is_special: data.is_special,
        preparation_time: data.preparation_time,
        allergens: data.allergens || [],
        dietary_info: data.dietary_info || [],
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setMenuItems(prev => prev.map(item => 
        item.id === id ? formattedItem : item
      ));
    } catch (error) {
      setError('Failed to update menu item');
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      if (!supabase) {
        // Demo mode
        setMenuItems(prev => prev.filter(item => item.id !== id));
        return;
      }

      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      setError('Failed to delete menu item');
      throw error;
    }
  };

  // Inventory functions
  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      if (!supabase) {
        // Demo mode
        const newItem: InventoryItem = {
          ...item,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString()
        };
        setInventory(prev => [...prev, newItem]);
        return;
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          name: item.name,
          category: item.category || 'General',
          unit: item.unit,
          current_stock: item.quantity,
          minimum_stock: item.minThreshold,
          maximum_stock: item.maxThreshold,
          cost_per_unit: item.cost,
          supplier: item.supplier
        })
        .select()
        .single();

      if (error) throw error;
      
      const newItem: InventoryItem = {
        id: data.id,
        name: data.name,
        quantity: data.current_stock,
        unit: data.unit,
        minThreshold: data.minimum_stock,
        maxThreshold: data.maximum_stock || 0,
        cost: data.cost_per_unit || 0,
        supplier: data.supplier,
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
      if (!supabase) {
        // Demo mode
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
        ));
        return;
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          unit: updates.unit,
          current_stock: updates.quantity,
          minimum_stock: updates.minThreshold,
          maximum_stock: updates.maxThreshold,
          cost_per_unit: updates.cost,
          supplier: updates.supplier
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setInventory(prev => prev.map(item => 
        item.id === id ? {
          ...item,
          name: data.name,
          quantity: data.current_stock,
          unit: data.unit,
          minThreshold: data.minimum_stock,
          maxThreshold: data.maximum_stock || 0,
          cost: data.cost_per_unit || 0,
          supplier: data.supplier,
          lastUpdated: new Date().toISOString()
        } : item
      ));
    } catch (error) {
      setError('Failed to update inventory item');
      throw error;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      if (!supabase) {
        // Demo mode
        setInventory(prev => prev.filter(item => item.id !== id));
        return;
      }

      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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