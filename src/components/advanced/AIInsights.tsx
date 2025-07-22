import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { DatabaseService } from '../../services/DatabaseService';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  AlertTriangle,
  Target,
  Lightbulb
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  data?: any;
}

const AIInsights: React.FC = () => {
  const { isDark } = useTheme();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const dbService = DatabaseService.getInstance();

  useEffect(() => {
    generateAIInsights();
  }, []);

  const generateAIInsights = async () => {
    setLoading(true);
    
    try {
      // Simulate AI analysis with real data patterns
      const orders = await dbService.getOrders();
      const menuItems = await dbService.getMenuItems();
      const customers = await dbService.getCustomers();
      
      const generatedInsights: AIInsight[] = [
        {
          id: '1',
          type: 'prediction',
          title: 'Peak Hour Prediction',
          description: 'Based on historical data, expect 40% increase in orders between 7-9 PM today.',
          confidence: 87,
          impact: 'high',
          actionable: true,
          data: { expectedOrders: 45, currentStaff: 3, recommendedStaff: 5 }
        },
        {
          id: '2',
          type: 'recommendation',
          title: 'Menu Optimization',
          description: 'Consider promoting Chicken Biryani - it has 92% customer satisfaction but low visibility.',
          confidence: 94,
          impact: 'medium',
          actionable: true,
          data: { item: 'Chicken Biryani', satisfaction: 92, currentSales: 15 }
        },
        {
          id: '3',
          type: 'alert',
          title: 'Inventory Alert',
          description: 'Paneer stock will run out in 2 days based on current consumption patterns.',
          confidence: 96,
          impact: 'high',
          actionable: true,
          data: { item: 'Paneer', daysLeft: 2, recommendedOrder: '5kg' }
        },
        {
          id: '4',
          type: 'optimization',
          title: 'Table Turnover',
          description: 'Table 5 has 23% longer average dining time. Consider gentle service reminders.',
          confidence: 78,
          impact: 'medium',
          actionable: true,
          data: { table: 5, avgTime: 67, optimalTime: 45 }
        },
        {
          id: '5',
          type: 'prediction',
          title: 'Revenue Forecast',
          description: 'This week\'s revenue is projected to be ₹45,000 based on current trends.',
          confidence: 85,
          impact: 'high',
          actionable: false,
          data: { projected: 45000, lastWeek: 42000, growth: 7.1 }
        }
      ];
      
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-6 w-6" />;
      case 'recommendation': return <Lightbulb className="h-6 w-6" />;
      case 'alert': return <AlertTriangle className="h-6 w-6" />;
      case 'optimization': return <Target className="h-6 w-6" />;
      default: return <Brain className="h-6 w-6" />;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'alert') return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    if (impact === 'high') return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
    if (impact === 'medium') return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    return 'border-green-500 bg-green-50 dark:bg-green-900/20';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-blue-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Analyzing data...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            AI Business Insights
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Intelligent recommendations powered by machine learning
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              getInsightColor(insight.type, insight.impact)
            } ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'alert' ? 'bg-red-500' :
                  insight.impact === 'high' ? 'bg-purple-500' :
                  insight.impact === 'medium' ? 'bg-blue-500' : 'bg-green-500'
                } text-white`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h3 className={`font-semibold text-lg ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.type === 'alert' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                    insight.impact === 'high' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
                    insight.impact === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                  }`}>
                    {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-semibold ${getConfidenceColor(insight.confidence)}`}>
                  {insight.confidence}%
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Confidence
                </div>
              </div>
            </div>

            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {insight.description}
            </p>

            {insight.data && (
              <div className={`p-3 rounded-lg mb-4 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(insight.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className={`capitalize ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {typeof value === 'number' && key.includes('revenue') || key.includes('projected') 
                          ? `₹${value.toLocaleString()}`
                          : value
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                }`}>
                  {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                </span>
                {insight.actionable && (
                  <span className={`text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200`}>
                    Actionable
                  </span>
                )}
              </div>
              
              {insight.actionable && (
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm transition-colors">
                  Take Action
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          AI Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              94%
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Prediction Accuracy
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ₹12,500
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Revenue Optimized
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              23
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Actions Taken
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              15%
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Efficiency Gain
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;