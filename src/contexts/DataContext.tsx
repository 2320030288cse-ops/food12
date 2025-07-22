import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  photo?: string;
  isSpecial: boolean;
  description?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  position?: { x: number; y: number };
  shape?: 'round' | 'square' | 'rectangle';
  orderStatus?: 'waiting' | 'preparing' | 'served' | 'billing';
  reservedBy?: string;
  reservedTime?: Date;
  currentOrderId?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  tableId: string;
  date: Date;
  time: string;
  people: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Feedback {
  id: string;
  orderId: string;
  foodRating: number;
  serviceRating: number;
  cleanlinessRating: number;
  comment?: string;
  date: Date;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  ingredients: { itemId: string; quantity: number }[];
}

export interface Combo {
  id: string;
  name: string;
  items: { menuItemId: string; quantity: number }[];
  price: number;
  available: boolean;
  description?: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'happy_hour' | 'combo' | 'discount';
  startTime?: string;
  endTime?: string;
  discount?: number;
  categories?: string[];
  active: boolean;
}

export interface CustomerLoyalty {
  id: string;
  phone: string;
  points: number;
  visits: number;
  totalSpent: number;
  lastVisit: Date;
  preferences?: {
    favoriteItems: string[];
    dietaryRestrictions: string[];
    spiceLevel: 'mild' | 'medium' | 'hot';
  };
}

export interface SMSTemplate {
  id: string;
  name: string;
  type: 'order_confirmation' | 'payment_receipt' | 'loyalty_reward' | 'feedback_request';
  template: string;
  active: boolean;
}

export interface NotificationSettings {
  id: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  templates: SMSTemplate[];
}
interface DataContextType {
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  tables: Table[];
  reservations: Reservation[];
  feedback: Feedback[];
  dailyCollections: DailyCollection[];
  recipes: Recipe[];
  combos: Combo[];
  promotions: Promotion[];
  customerLoyalty: CustomerLoyalty[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id'>) => void;
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  updateTablePosition: (tableId: string, position: { x: number; y: number }) => void;
  updateTableOrderStatus: (tableId: string, orderStatus: Table['orderStatus']) => void;
  blockTableForOrder: (tableId: string, orderId: string, customerName?: string) => void;
  releaseTableAfterPayment: (tableId: string) => void;
  reduceInventory: (itemName: string, quantity: number) => void;
  reduceInventoryByRecipe: (menuItemId: string, quantity: number) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  addCombo: (combo: Omit<Combo, 'id'>) => void;
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  addCustomerLoyalty: (customer: Omit<CustomerLoyalty, 'id'>) => void;
  updateCustomerLoyalty: (phone: string, points: number, spent: number) => void;
  getPopularItems: () => MenuItem[];
  getDailyCollections: () => Promise<DailyCollection[]>;
  updateDailyCollection: (date: string, amount: number, paymentMethods: Record<string, number>) => Promise<void>;
}

export interface DailyCollection {
  id: string;
  date: string;
  total_amount: number;
  total_orders: number;
  payment_methods: Record<string, number>;
  created_at: string;
  updated_at: string;
}
const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const defaultMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Chicken Tikka Masala',
    category: 'Main Course',
    price: 299,
    available: true,
    photo: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: true,
    description: 'Tender chicken in creamy tomato sauce'
  },
  {
    id: '2',
    name: 'Vegetable Biryani',
    category: 'Main Course',
    price: 249,
    available: true,
    photo: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Aromatic basmati rice with vegetables'
  },
  {
    id: '3',
    name: 'Samosa',
    category: 'Starter',
    price: 49,
    available: true,
    photo: 'https://images.pexels.com/photos/14477797/pexels-photo-14477797.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Crispy pastry with spiced filling'
  },
  {
    id: '4',
    name: 'Gulab Jamun',
    category: 'Dessert',
    price: 89,
    available: true,
    photo: 'https://images.pexels.com/photos/4772874/pexels-photo-4772874.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Sweet milk balls in sugar syrup'
  },
  {
    id: '5',
    name: 'Butter Chicken',
    category: 'Main Course',
    price: 329,
    available: true,
    photo: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: true,
    description: 'Rich and creamy chicken curry'
  },
  {
    id: '6',
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 279,
    available: true,
    photo: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Cottage cheese in rich tomato gravy'
  },
  {
    id: '7',
    name: 'Chicken Wings',
    category: 'Starter',
    price: 199,
    available: true,
    photo: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Spicy grilled chicken wings'
  },
  {
    id: '8',
    name: 'Paneer Tikka',
    category: 'Starter',
    price: 179,
    available: true,
    photo: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Grilled cottage cheese with spices'
  },
  {
    id: '9',
    name: 'Fish Curry',
    category: 'Main Course',
    price: 349,
    available: true,
    photo: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: true,
    description: 'Fresh fish in coconut curry'
  },
  {
    id: '10',
    name: 'Mutton Biryani',
    category: 'Main Course',
    price: 399,
    available: true,
    photo: 'https://images.pexels.com/photos/11220209/pexels-photo-11220209.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: true,
    description: 'Aromatic rice with tender mutton'
  },
  {
    id: '11',
    name: 'Naan Bread',
    category: 'Bread',
    price: 45,
    available: true,
    photo: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Fresh baked Indian bread'
  },
  {
    id: '12',
    name: 'Garlic Naan',
    category: 'Bread',
    price: 55,
    available: true,
    photo: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Naan bread with garlic and herbs'
  },
  {
    id: '13',
    name: 'Dal Tadka',
    category: 'Main Course',
    price: 149,
    available: true,
    photo: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Yellow lentils with spices'
  },
  {
    id: '14',
    name: 'Chicken Soup',
    category: 'Soup',
    price: 99,
    available: true,
    photo: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Hot and spicy chicken soup'
  },
  {
    id: '15',
    name: 'Tomato Soup',
    category: 'Soup',
    price: 79,
    available: true,
    photo: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Fresh tomato soup with herbs'
  },
  {
    id: '16',
    name: 'Ice Cream',
    category: 'Dessert',
    price: 69,
    available: true,
    photo: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Vanilla ice cream with toppings'
  },
  {
    id: '17',
    name: 'Kulfi',
    category: 'Dessert',
    price: 79,
    available: true,
    photo: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Traditional Indian ice cream'
  },
  {
    id: '18',
    name: 'Mango Lassi',
    category: 'Beverage',
    price: 89,
    available: true,
    photo: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Fresh mango yogurt drink'
  },
  {
    id: '19',
    name: 'Fresh Lime Soda',
    category: 'Beverage',
    price: 49,
    available: true,
    photo: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Refreshing lime soda'
  },
  {
    id: '20',
    name: 'Masala Chai',
    category: 'Beverage',
    price: 29,
    available: true,
    photo: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400',
    isSpecial: false,
    description: 'Traditional spiced tea'
  }
];

const defaultInventory: InventoryItem[] = [
  { id: '1', name: 'Chicken', quantity: 50, unit: 'kg', minQuantity: 10 },
  { id: '2', name: 'Rice', quantity: 100, unit: 'kg', minQuantity: 20 },
  { id: '3', name: 'Tomatoes', quantity: 25, unit: 'kg', minQuantity: 5 },
  { id: '4', name: 'Onions', quantity: 30, unit: 'kg', minQuantity: 8 },
];

const defaultTables: Table[] = [
  { id: '1', number: 1, capacity: 4, status: 'available', position: { x: 100, y: 100 }, shape: 'round' },
  { id: '2', number: 2, capacity: 2, status: 'available', position: { x: 300, y: 100 }, shape: 'square' },
  { id: '3', number: 3, capacity: 6, status: 'available', position: { x: 500, y: 100 }, shape: 'rectangle' },
  { id: '4', number: 4, capacity: 4, status: 'available', position: { x: 100, y: 300 }, shape: 'round' },
  { id: '5', number: 5, capacity: 8, status: 'available', position: { x: 300, y: 300 }, shape: 'rectangle' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory);
  const [tables, setTables] = useState<Table[]>(defaultTables);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [dailyCollections, setDailyCollections] = useState<DailyCollection[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [customerLoyalty, setCustomerLoyalty] = useState<CustomerLoyalty[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('gs_data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setMenuItems(data.menuItems || defaultMenuItems);
      setInventory(data.inventory || defaultInventory);
      setTables(data.tables || defaultTables);
      setReservations(data.reservations || []);
      setFeedback(data.feedback || []);
      setDailyCollections(data.dailyCollections || []);
      setRecipes(data.recipes || []);
      setCombos(data.combos || []);
      setPromotions(data.promotions || []);
      setCustomerLoyalty(data.customerLoyalty || []);
    }
    
    // Load daily collections from database
    loadDailyCollections();
  }, []);

  useEffect(() => {
    const data = {
      menuItems,
      inventory,
      tables,
      reservations,
      feedback,
      dailyCollections,
      recipes,
      combos,
      promotions,
      customerLoyalty
    };
    localStorage.setItem('gs_data', JSON.stringify(data));
  }, [menuItems, inventory, tables, reservations, feedback, dailyCollections, recipes, combos, promotions, customerLoyalty]);

  const loadDailyCollections = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, using local storage');
        return;
      }
      const { data, error } = await supabase
        .from('daily_collections')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      if (data) setDailyCollections(data);
    } catch (error) {
      console.log('Using local storage for daily collections');
    }
  };
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString()
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  const addReservation = (reservation: Omit<Reservation, 'id'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString()
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = (id: string, reservation: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...reservation } : r));
  };

  const addFeedback = (feedbackData: Omit<Feedback, 'id'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString()
    };
    setFeedback(prev => [...prev, newFeedback]);
  };

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const updateTablePosition = (tableId: string, position: { x: number; y: number }) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, position } : t));
  };

  const updateTableOrderStatus = (tableId: string, orderStatus: Table['orderStatus']) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, orderStatus } : t));
  };
  const blockTableForOrder = (tableId: string, orderId: string, customerName?: string) => {
    setTables(prev => prev.map(t => 
      t.id === tableId 
        ? { 
            ...t, 
            status: 'occupied' as const,
            orderStatus: 'waiting' as const,
            currentOrderId: orderId,
            reservedBy: customerName || `Order #${orderId.slice(-6)}`,
            reservedTime: new Date()
          } 
        : t
    ));
  };
  const reduceInventory = (itemName: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.name.toLowerCase() === itemName.toLowerCase() 
        ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
        : item
    ));
  };

  const reduceInventoryByRecipe = (menuItemId: string, quantity: number) => {
    const recipe = recipes.find(r => r.menuItemId === menuItemId);
    if (recipe) {
      recipe.ingredients.forEach(ingredient => {
        const inventoryItem = inventory.find(inv => inv.id === ingredient.itemId);
        if (inventoryItem) {
          const totalQuantityNeeded = ingredient.quantity * quantity;
          reduceInventory(inventoryItem.name, totalQuantityNeeded);
        }
      });
    }
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString()
    };
    setRecipes(prev => [...prev, newRecipe]);
  };

  const addCombo = (combo: Omit<Combo, 'id'>) => {
    const newCombo: Combo = {
      ...combo,
      id: Date.now().toString()
    };
    setCombos(prev => [...prev, newCombo]);
  };

  const addPromotion = (promotion: Omit<Promotion, 'id'>) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: Date.now().toString()
    };
    setPromotions(prev => [...prev, newPromotion]);
  };

  const addCustomerLoyalty = (customer: Omit<CustomerLoyalty, 'id'>) => {
    const newCustomer: CustomerLoyalty = {
      ...customer,
      id: Date.now().toString()
    };
    setCustomerLoyalty(prev => [...prev, newCustomer]);
  };

  const updateCustomerLoyalty = (phone: string, points: number, spent: number) => {
    setCustomerLoyalty(prev => {
      const existing = prev.find(c => c.phone === phone);
      if (existing) {
        return prev.map(c => 
          c.phone === phone 
            ? { 
                ...c, 
                points: c.points + points, 
                visits: c.visits + 1,
                totalSpent: c.totalSpent + spent,
                lastVisit: new Date()
              }
            : c
        );
      } else {
        return [...prev, {
          id: Date.now().toString(),
          phone,
          points,
          visits: 1,
          totalSpent: spent,
          lastVisit: new Date()
        }];
      }
    });
  };

  const getPopularItems = (): MenuItem[] => {
    // This would typically be based on order history
    // For now, return special items and first few items
    return menuItems
      .filter(item => item.isSpecial || item.available)
      .slice(0, 8);
  };
  const getDailyCollections = async (): Promise<DailyCollection[]> => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, using local storage');
        return dailyCollections;
      }
      const { data, error } = await supabase
        .from('daily_collections')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Using local storage for daily collections');
      return dailyCollections;
    }
  };
  const releaseTableAfterPayment = (tableId: string) => {
    setTables(prev => prev.map(t => 
      t.id === tableId 
        ? { 
            ...t, 
            status: 'available' as const,
            reservedBy: undefined,
            reservedTime: undefined
          } 
        : t
    ));
  };
  const updateDailyCollection = async (date: string, amount: number, paymentMethods: Record<string, number>) => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, using local storage fallback');
        // Fallback to local storage logic
        const today = new Date().toISOString().split('T')[0];
        setDailyCollections(prev => {
          const existing = prev.find(dc => dc.date === date);
          if (existing) {
            const updatedPaymentMethods = { ...existing.payment_methods };
            Object.entries(paymentMethods).forEach(([method, methodAmount]) => {
              updatedPaymentMethods[method] = (updatedPaymentMethods[method] || 0) + methodAmount;
            });
            
            return prev.map(dc => 
              dc.date === date 
                ? {
                    ...dc,
                    total_amount: dc.total_amount + amount,
                    total_orders: dc.total_orders + 1,
                    payment_methods: updatedPaymentMethods,
                    updated_at: new Date().toISOString()
                  }
                : dc
            );
          } else {
            return [...prev, {
              id: Date.now().toString(),
              date,
              total_amount: amount,
              total_orders: 1,
              payment_methods: paymentMethods,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }];
          }
        });
        return;
      }
      
      const { data: existing, error: fetchError } = await supabase
        .from('daily_collections')
        .select('*')
        .eq('date', date)
        .single();
      if (existing) {
        // Update existing record
        const updatedPaymentMethods = { ...existing.payment_methods };
        Object.entries(paymentMethods).forEach(([method, methodAmount]) => {
          updatedPaymentMethods[method] = (updatedPaymentMethods[method] || 0) + methodAmount;
        });

        const { error: updateError } = await supabase
          .from('daily_collections')
          .update({
            total_amount: existing.total_amount + amount,
            total_orders: existing.total_orders + 1,
            payment_methods: updatedPaymentMethods,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('daily_collections')
          .insert({
            date,
            total_amount: amount,
            total_orders: 1,
            payment_methods: paymentMethods,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        if (insertError) throw insertError;
      }
      // Refresh local data
      await loadDailyCollections();
    } catch (error) {
      console.log('Using local storage for daily collections');
      
      // Fallback to local storage
      const today = new Date().toISOString().split('T')[0];
      setDailyCollections(prev => {
        const existing = prev.find(dc => dc.date === date);
        if (existing) {
          const updatedPaymentMethods = { ...existing.payment_methods };
          Object.entries(paymentMethods).forEach(([method, methodAmount]) => {
            updatedPaymentMethods[method] = (updatedPaymentMethods[method] || 0) + methodAmount;
          });
          
          return prev.map(dc => 
            dc.date === date 
              ? {
                  ...dc,
                  total_amount: dc.total_amount + amount,
                  total_orders: dc.total_orders + 1,
                  payment_methods: updatedPaymentMethods,
                  updated_at: new Date().toISOString()
                }
              : dc
          );
        } else {
          return [...prev, {
            id: Date.now().toString(),
            date,
            total_amount: amount,
            total_orders: 1,
            payment_methods: paymentMethods,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }];
        }
      });
    }
  };
  return (
    <DataContext.Provider value={{
      menuItems,
      inventory,
      tables,
      reservations,
      feedback,
      dailyCollections,
      recipes,
      combos,
      promotions,
      customerLoyalty,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addInventoryItem,
      updateInventoryItem,
      addReservation,
      updateReservation,
      addFeedback,
      updateTableStatus,
      updateTablePosition,
      updateTableOrderStatus,
      blockTableForOrder,
      releaseTableAfterPayment,
      reduceInventory,
      reduceInventoryByRecipe,
      addRecipe,
      addCombo,
      addPromotion,
      addCustomerLoyalty,
      updateCustomerLoyalty,
      getPopularItems,
      getDailyCollections,
      updateDailyCollection
    }}>
      {children}
    </DataContext.Provider>
  );
};