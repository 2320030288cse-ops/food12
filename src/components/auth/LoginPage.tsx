import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ChefHat, Moon, Sun, Lock, Mail } from 'lucide-react';

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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-yellow-50 to-orange-100'
    }`}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${
                isDark ? 'bg-yellow-600' : 'bg-yellow-500'
              }`}>
                <ChefHat className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className={`text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              GS Restaurant
            </h2>
            <p className={`mt-2 text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Order Management System
            </p>
          </div>

          {/* Login Form */}
          <div className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
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
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-500'
                    } focus:outline-none focus:ring-2 focus:ring-yellow-500/20`}
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
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-500'
                    } focus:outline-none focus:ring-2 focus:ring-yellow-500/20`}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className={`mt-6 p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
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
          <div className="flex justify-center">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              } shadow-lg`}
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