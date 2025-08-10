import { supabase } from '../lib/supabase';
import type {
  Restaurant,
  User,
  MenuItem,
  InventoryItem,
  Table,
  Customer,
  Order,
  OrderItem,
  Payment,
  Reservation,
  Feedback,
  Recipe,
  Combo,
  Promotion,
  LoyaltyProgram,
  SMSTemplate,
  Notification,
  AnalyticsData,
  AuditLog
} from '../lib/supabase';

export class DatabaseService {
  private static instance: DatabaseService;
  private restaurantId: string | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  setRestaurantId(restaurantId: string) {
    this.restaurantId = restaurantId;
  }

  // Restaurant Management
  async getRestaurant(id: string): Promise<Restaurant | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Menu Management
  async getMenuItems(): Promise<MenuItem[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', this.restaurantId)
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createMenuItem(item: Omit<MenuItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert({ ...item, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Inventory Management
  async getInventoryItems(): Promise<InventoryItem[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('restaurant_id', this.restaurantId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>): Promise<InventoryItem | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({ ...item, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Table Management
  async getTables(): Promise<Table[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', this.restaurantId)
      .order('table_number', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async updateTable(id: string, updates: Partial<Table>): Promise<Table | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Customer Management
  async getCustomers(): Promise<Customer[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('restaurant_id', this.restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>): Promise<Customer | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('customers')
      .insert({ ...customer, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Order Management
  async getOrders(): Promise<Order[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name, price)
        ),
        customers (name, phone),
        tables (table_number)
      `)
      .eq('restaurant_id', this.restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createOrder(order: Omit<Order, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]): Promise<Order | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ ...order, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    if (items.length > 0) {
      const orderItems = items.map(item => ({
        ...item,
        order_id: orderData.id
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
    }
    
    return orderData;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Payment Management
  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPayments(orderId?: string): Promise<Payment[]> {
    if (!supabase) return [];
    
    let query = supabase.from('payments').select('*');
    
    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Reservation Management
  async getReservations(): Promise<Reservation[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        customers (name, phone),
        tables (table_number, capacity)
      `)
      .eq('restaurant_id', this.restaurantId)
      .order('reservation_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createReservation(reservation: Omit<Reservation, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>): Promise<Reservation | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('reservations')
      .insert({ ...reservation, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Feedback Management
  async getFeedback(): Promise<Feedback[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        orders (order_number),
        customers (name)
      `)
      .eq('restaurant_id', this.restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createFeedback(feedback: Omit<Feedback, 'id' | 'restaurant_id' | 'created_at'>): Promise<Feedback | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('feedback')
      .insert({ ...feedback, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Analytics
  async getAnalyticsData(metricName?: string, dateFrom?: string, dateTo?: string): Promise<AnalyticsData[]> {
    if (!supabase || !this.restaurantId) return [];
    
    let query = supabase
      .from('analytics_data')
      .select('*')
      .eq('restaurant_id', this.restaurantId);
    
    if (metricName) {
      query = query.eq('metric_name', metricName);
    }
    
    if (dateFrom) {
      query = query.gte('date_recorded', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('date_recorded', dateTo);
    }
    
    const { data, error } = await query.order('date_recorded', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createAnalyticsData(analytics: Omit<AnalyticsData, 'id' | 'restaurant_id' | 'created_at'>): Promise<AnalyticsData | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('analytics_data')
      .insert({ ...analytics, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // SMS Templates
  async getSMSTemplates(): Promise<SMSTemplate[]> {
    if (!supabase || !this.restaurantId) return [];
    
    const { data, error } = await supabase
      .from('sms_templates')
      .select('*')
      .eq('restaurant_id', this.restaurantId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  }

  async createSMSTemplate(template: Omit<SMSTemplate, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>): Promise<SMSTemplate | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('sms_templates')
      .insert({ ...template, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Notifications
  async getNotifications(userId?: string): Promise<Notification[]> {
    if (!supabase || !this.restaurantId) return [];
    
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('restaurant_id', this.restaurantId);
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createNotification(notification: Omit<Notification, 'id' | 'restaurant_id' | 'created_at'>): Promise<Notification | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({ ...notification, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    return !error;
  }

  // Audit Logging
  async createAuditLog(log: Omit<AuditLog, 'id' | 'restaurant_id' | 'created_at'>): Promise<AuditLog | null> {
    if (!supabase || !this.restaurantId) return null;
    
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({ ...log, restaurant_id: this.restaurantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Utility Methods
  async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GS${timestamp}${random}`;
  }

  // Daily Collections Management
  async getDailyCollections(): Promise<any[]> {
    if (!supabase) return [];
    
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
    return data || [];
  }

  async updateDailyCollection(date: string, amount: number, paymentMethod: string): Promise<void> {
    if (!supabase) return;
    
    try {
      // First, try to get existing record
      const { data: existing, error: fetchError } = await supabase
        .from('daily_collections')
        .select('*')
        .eq('date', date)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existing) {
        // Update existing record
        const updatedPaymentMethods = { ...existing.payment_methods };
        updatedPaymentMethods[paymentMethod] = (updatedPaymentMethods[paymentMethod] || 0) + amount;
        
        const { error: updateError } = await supabase
          .from('daily_collections')
          .update({
            total_amount: existing.total_amount + amount,
            total_orders: existing.total_orders + 1,
            payment_methods: updatedPaymentMethods
          })
          .eq('date', date);
        
        if (updateError) throw updateError;
      } else {
        // Create new record
        const paymentMethods = {
          cash: paymentMethod === 'cash' ? amount : 0,
          card: paymentMethod === 'card' ? amount : 0,
          upi: paymentMethod === 'upi' ? amount : 0,
          wallet: paymentMethod === 'wallet' ? amount : 0
        };
        
        const { error: insertError } = await supabase
          .from('daily_collections')
          .insert({
            date,
            total_amount: amount,
            total_orders: 1,
            payment_methods: paymentMethods,
            bills_generated: 1
          });
        
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating daily collection:', error);
      throw error;
    }
  async saveBill(billData: any): Promise<string> {
    if (!supabase) throw new Error('Database not available');
    
    try {
      // Generate bill number
      const { data: billNumber, error: billNumberError } = await supabase
        .rpc('generate_bill_number');
      
      if (billNumberError) throw billNumberError;
      
      // Create bill record
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .insert({
          bill_number: billNumber,
          order_id: billData.orderId,
          customer_name: billData.customerName,
          customer_phone: billData.customerPhone,
          table_number: billData.tableNumber,
          subtotal: billData.subtotal,
          tax_amount: billData.tax,
          total_amount: billData.total,
          payment_method: billData.paymentMethod || 'cash',
          payment_status: billData.paymentStatus || 'paid'
        })
        .select()
        .single();
      
      if (billError) throw billError;
      
      // Create bill items
      if (billData.items && billData.items.length > 0) {
        const billItems = billData.items.map((item: any) => ({
          bill_id: bill.id,
          item_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.subtotal
        }));
        
        const { error: itemsError } = await supabase
          .from('bill_items')
          .insert(billItems);
        
        if (itemsError) throw itemsError;
      }
      
      // Update daily collection
      const today = new Date().toISOString().split('T')[0];
      await this.updateDailyCollection(today, billData.total, billData.paymentMethod || 'cash');
      
      return billNumber;
    } catch (error) {
      console.error('Error saving bill:', error);
      throw error;
    }
  }
  }
  async generateQRCode(tableId: string): Promise<string> {
    // Generate QR code URL for table
    const baseUrl = window.location.origin;
    return `${baseUrl}?table=${tableId}`;
  }
}