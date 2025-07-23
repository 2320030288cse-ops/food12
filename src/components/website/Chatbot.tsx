import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff } from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantInfo: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, restaurantInfo }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! Welcome to ${restaurantInfo.name}! I'm here to help you with menu information, reservations, and any questions you might have. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const quickReplies = [
    'Show me the menu',
    'What are your hours?',
    'Make a reservation',
    'What are today\'s specials?',
    'Do you have vegetarian options?',
    'What\'s your address?'
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text.trim().toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateBotResponse = (userInput: string): string => {
    if (userInput.includes('menu') || userInput.includes('food') || userInput.includes('dish')) {
      return `Our menu features authentic Indian cuisine with specialties like Chicken Tikka Masala, Butter Chicken, and Vegetable Biryani. We have options for all dietary preferences including vegetarian, vegan, and gluten-free dishes. Would you like me to tell you about any specific category?`;
    }
    
    if (userInput.includes('hours') || userInput.includes('time') || userInput.includes('open')) {
      return `We're open ${restaurantInfo.hours.weekdays} on weekdays and ${restaurantInfo.hours.weekends} on weekends. We're here to serve you delicious food throughout these hours!`;
    }
    
    if (userInput.includes('reservation') || userInput.includes('book') || userInput.includes('table')) {
      return `I'd be happy to help you with a reservation! You can click the "Reserve" button on our website to book a table. We recommend booking in advance, especially for weekends and special occasions.`;
    }
    
    if (userInput.includes('special') || userInput.includes('today')) {
      return `Today's specials include our signature Chicken Tikka Masala and Butter Chicken! These are our chef's recommendations and customer favorites. Both are made with authentic spices and fresh ingredients.`;
    }
    
    if (userInput.includes('vegetarian') || userInput.includes('vegan') || userInput.includes('veg')) {
      return `Absolutely! We have a wide variety of vegetarian and vegan options including Paneer Butter Masala, Vegetable Biryani, Dal Tadka, and many more. All our vegetarian dishes are clearly marked on the menu.`;
    }
    
    if (userInput.includes('address') || userInput.includes('location') || userInput.includes('where')) {
      return `We're located at ${restaurantInfo.address}. You can easily find us using GPS navigation, and we have convenient parking available for our guests.`;
    }
    
    if (userInput.includes('phone') || userInput.includes('call') || userInput.includes('contact')) {
      return `You can reach us at ${restaurantInfo.phone} for any inquiries or reservations. Our staff is always happy to help you with any questions!`;
    }
    
    if (userInput.includes('price') || userInput.includes('cost') || userInput.includes('expensive')) {
      return `Our prices are very reasonable for the quality we offer! Main courses range from ₹249-₹329, starters from ₹49-₹199, and beverages from ₹29-₹89. We believe in providing great value for authentic, delicious food.`;
    }
    
    if (userInput.includes('delivery') || userInput.includes('takeaway') || userInput.includes('order online')) {
      return `Yes! We offer both delivery and takeaway services. You can place an order through our website by clicking the "Order" button. We ensure your food reaches you hot and fresh!`;
    }
    
    if (userInput.includes('thank') || userInput.includes('thanks')) {
      return `You're very welcome! It's my pleasure to help. If you have any other questions about our restaurant, menu, or services, feel free to ask. We look forward to serving you soon!`;
    }
    
    if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
      return `Hello there! Great to chat with you. I'm here to help you with anything you'd like to know about ${restaurantInfo.name}. What would you like to know about our restaurant?`;
    }

    // Default response
    return `Thank you for your question! I'm here to help with information about our menu, reservations, hours, location, and services. You can also call us at ${restaurantInfo.phone} for immediate assistance. What specific information would you like to know?`;
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
      <div className={`w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } animate-slide-up`}>
        {/* Header */}
        <div className={`p-4 border-b rounded-t-2xl ${
          isDark ? 'bg-gray-700 border-gray-600' : 'bg-primary text-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">GS Assistant</h3>
                <p className="text-sm opacity-90">Online now</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-2xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickReplies.slice(0, 3).map((reply, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(reply)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${
          isDark ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Type your message..."
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                } focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
            </div>
            <button
              onClick={startVoiceRecognition}
              className={`p-3 rounded-xl transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl transition-colors ${
                inputText.trim()
                  ? 'bg-primary hover:bg-primary-dark text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;