import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, Lock, Mail } from 'lucide-react';
import GSLogo from '../common/GSLogo';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark ? 'bg-gray-900' : 'animated-bg'
    }`}>
      {/* Hero Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gs-gold opacity-20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gs-light-gold opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center animate-slide-down">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <GSLogo size="xl" animated />
              </div>
            </div>
            <h2 className={`text-5xl font-bold gradient-text animate-fade-in ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              GS Restaurant
            </h2>
            <p className={`mt-4 text-xl font-medium animate-slide-up ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Order Management System
            </p>
          </div>

          {/* Login Form */}
          <div className={`glass backdrop-blur-xl p-8 rounded-3xl shadow-2xl border animate-zoom-in ${
            isDark ? 'border-gray-700 glass-dark' : 'border-white/20'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg animate-shake">
                  {error}
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:scale-105 ${
                      isDark 
                        ? 'neumorphism-dark border-gray-600 text-white focus:border-gs-gold' 
                        : 'neumorphism border-gray-300 text-gray-900 focus:border-gs-gold'
                    } focus:outline-none focus:ring-2 focus:ring-gs-gold/20 focus:shadow-glow-gold`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:scale-105 ${
                      isDark 
                        ? 'neumorphism-dark border-gray-600 text-white focus:border-gs-gold' 
                        : 'neumorphism border-gray-300 text-gray-900 focus:border-gs-gold'
                    } focus:outline-none focus:ring-2 focus:ring-gs-gold/20 focus:shadow-glow-gold`}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span className="animate-fade-in">Sign In</span>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className={`mt-6 p-4 rounded-xl animate-slide-up ${
              isDark ? 'neumorphism-dark' : 'neumorphism'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Demo Credentials:
              </p>
              <div className={`text-sm space-y-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div>Admin: admin@gs.com / password</div>
                <div>Staff: staff@gs.com / password</div>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center animate-fade-in">
            <button
              onClick={toggleTheme}
              className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                isDark 
                  ? 'neumorphism-dark text-gs-gold hover:shadow-glow-gold' 
                  : 'neumorphism text-gray-600 hover:text-gs-gold'
              } shadow-xl`}
            >
              {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;