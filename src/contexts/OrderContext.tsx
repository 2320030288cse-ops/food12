import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from './DataContext';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  tableNumber?: number;
  customerName?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  tax: number;
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'partial';
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'cash' | 'card' | 'upi' | 'wallet';
  amount: number;
  timestamp: Date;
}

interface OrderContextType {
  orders: Order[];
  payments: Payment[];
  currentOrder: OrderItem[];
  addToOrder: (menuItemId: string, name: string, price: number) => void;
  removeFromOrder: (id: string) => void;
  updateOrderQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
  submitOrder: (tableNumber?: number, customerName?: string) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'timestamp'>) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  getTotalRevenue: () => number;
  getOrderStats: () => { total: number; pending: number; completed: number };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const { blockTableForOrder, releaseTableAfterPayment, updateDailyCollection } = useData();

  useEffect(() => {
    const savedOrders = localStorage.getItem('gs_orders');
    const savedPayments = localStorage.getItem('gs_payments');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gs_payments', JSON.stringify(payments));
  }, [payments]);

  const addToOrder = (menuItemId: string, name: string, price: number) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(item => item.menuItemId === menuItemId);
      if (existingItem) {
        return prev.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * price }
            : item
        );
      } else {
        return [...prev, {
          id: Date.now().toString(),
          menuItemId,
          name,
          price,
          quantity: 1,
          subtotal: price
        }];
      }
    });
  };

  const removeFromOrder = (id: string) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== id));
  };

  const updateOrderQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(id);
      return;
    }
    setCurrentOrder(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantity, subtotal: quantity * item.price }
        : item
    ));
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  const submitOrder = (tableNumber?: number, customerName?: string): string => {
    const subtotal = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + tax;

    const newOrder: Order = {
      id: Date.now().toString(),
      items: currentOrder,
      tableNumber,
      customerName,
      status: 'pending',
      total,
      tax,
      createdAt: new Date(),
      createdBy: 'current-user',
      paymentStatus: 'pending'
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Block table if table number is provided
    if (tableNumber) {
      const tableId = `table-${tableNumber}`;
      blockTableForOrder(tableId, newOrder.id, customerName);
    }
    
    setCurrentOrder([]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { 
            ...order, 
            status, 
            completedAt: status === 'completed' ? new Date() : order.completedAt 
          }
        : order
    ));
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'timestamp'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setPayments(prev => [...prev, newPayment]);
    
    // Update daily collection when payment is added
    const order = orders.find(o => o.id === payment.orderId);
    if (order) {
      const today = new Date().toISOString().split('T')[0];
      const paymentMethods = { [payment.method]: payment.amount };
      updateDailyCollection(today, payment.amount, paymentMethods);
    }
  };

  const updatePaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, paymentStatus: status } : order
    ));
    
    // Release table when payment is completed
    if (status === 'paid') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.tableNumber) {
        const tableId = `table-${order.tableNumber}`;
        releaseTableAfterPayment(tableId);
      }
    }
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const completed = orders.filter(order => order.status === 'completed').length;
    return { total, pending, completed };
  };

  return (
    <OrderContext.Provider value={{
      orders,
      payments,
      currentOrder,
      addToOrder,
      removeFromOrder,
      updateOrderQuantity,
      clearOrder,
      submitOrder,
      updateOrderStatus,
      addPayment,
      updatePaymentStatus,
      getTotalRevenue,
      getOrderStats
    }}>
      {children}
    </OrderContext.Provider>
  );
};