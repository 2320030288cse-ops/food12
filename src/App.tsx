import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import RestaurantWebsite from './components/website/RestaurantWebsite';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <RestaurantWebsite />
    </ThemeProvider>
  );
}

export default App;