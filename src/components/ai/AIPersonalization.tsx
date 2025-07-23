import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Brain, Clock, Utensils, Heart, Settings, X } from 'lucide-react';

interface UserPreferences {
  dietary: string;
  spiceLevel: string;
  visitTime: string;
  favoriteCategories: string[];
}

interface AIPersonalizationProps {
  userPreferences: UserPreferences;
  onPreferencesUpdate: (preferences: UserPreferences) => void;
}

const AIPersonalization: React.FC<AIPersonalizationProps> = ({
  userPreferences,
  onPreferencesUpdate
}) => {
  const { isDark } = useTheme();
  const [showPreferences, setShowPreferences] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, [userPreferences]);

  const generatePersonalizedRecommendations = () => {
    const currentHour = new Date().getHours();
    let timeBasedRecs: string[] = [];

    if (currentHour < 12) {
      timeBasedRecs = ['Fresh Fruit Juice', 'Breakfast Special', 'Morning Tea'];
    } else if (currentHour < 17) {
      timeBasedRecs = ['Lunch Combo', 'Fresh Salads', 'Light Snacks'];
    } else {
      timeBasedRecs = ['Dinner Specials', 'Chef\'s Recommendations', 'Desserts'];
    }

    // Add dietary-based recommendations
    if (userPreferences.dietary === 'veg') {
      timeBasedRecs.push('Paneer Specialties', 'Vegetable Curries');
    } else if (userPreferences.dietary === 'vegan') {
      timeBasedRecs.push('Plant-Based Options', 'Vegan Desserts');
    }

    setRecommendations(timeBasedRecs);
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning! ☀️';
    if (hour < 17) return 'Good Afternoon! 🌤️';
    return 'Good Evening! 🌙';
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const updated = { ...userPreferences, [key]: value };
    onPreferencesUpdate(updated);
  };

  return (
    <>
      {/* AI Personalization Banner */}
      <div className={`py-4 border-b transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-gray-700' 
          : 'bg-gradient-to-r from-purple-50 to-blue-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {getCurrentTimeGreeting()} Personalized for you
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Based on your preferences: {recommendations.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPreferences(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl animate-scale-in`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Personalize Your Experience
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className={`p-2 rounded-lg ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Utensils className="h-4 w-4 inline mr-2" />
                  Dietary Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['all', 'veg', 'vegan', 'gluten-free'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePreferenceChange('dietary', option)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        userPreferences.dietary === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Heart className="h-4 w-4 inline mr-2" />
                  Spice Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['mild', 'medium', 'hot'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handlePreferenceChange('spiceLevel', level)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        userPreferences.spiceLevel === level
                          ? 'border-primary bg-primary/10 text-primary'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Clock className="h-4 w-4 inline mr-2" />
                  Preferred Visit Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['breakfast', 'lunch', 'dinner'].map((time) => (
                    <button
                      key={time}
                      onClick={() => handlePreferenceChange('visitTime', time)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        userPreferences.visitTime === time
                          ? 'border-primary bg-primary/10 text-primary'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Recommendations:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recommendations.map((rec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPreferences(false)}
              className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIPersonalization;