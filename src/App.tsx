import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OrderProvider } from './contexts/OrderContext';
import AppRouter from './components/AppRouter';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <OrderProvider>
            <AppRouter />
          </OrderProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;