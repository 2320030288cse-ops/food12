import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Mic, MicOff, Search, X, Volume2 } from 'lucide-react';

interface SmartSearchProps {
  onClose: () => void;
  onAddToOrder: (menuItemId: string, name: string, price: number) => void;
  tables: any[];
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onClose, onAddToOrder, tables }) => {
  const { menuItems } = useData();
  const { isDark } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Parse voice commands like "add two chicken biryani and one coke to table five"
    const matches = menuItems.filter(item => 
      lowerCommand.includes(item.name.toLowerCase()) ||
      item.name.toLowerCase().includes(lowerCommand.split(' ').find(word => word.length > 3) || '')
    );
    
    setSearchResults(matches);
    
    // Auto-process simple commands
    const quantityMatch = lowerCommand.match(/(\w+)\s+(chicken|paneer|dal|rice|naan|biryani)/);
    if (quantityMatch) {
      const quantityWord = quantityMatch[1];
      const quantity = getQuantityFromWord(quantityWord);
      const itemName = quantityMatch[2];
      
      const item = menuItems.find(i => i.name.toLowerCase().includes(itemName));
      if (item && quantity > 0) {
        for (let i = 0; i < quantity; i++) {
          onAddToOrder(item.id, item.name, item.price);
        }
        
        // Show success message
        speak(`Added ${quantity} ${item.name} to order`);
      }
    }
  };

  const getQuantityFromWord = (word: string): number => {
    const quantities: { [key: string]: number } = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
      '6': 6, '7': 7, '8': 8, '9': 9, '10': 10
    };
    return quantities[word.toLowerCase()] || 1;
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleTextSearch = (searchTerm: string) => {
    if (searchTerm.length > 2) {
      const matches = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(matches);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Smart Search & Voice Commands
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Voice Recognition */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-6 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>
          </div>
          
          <div className="text-center">
            <p className={`text-sm mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isListening ? 'Listening... Speak now!' : 'Click the microphone to start voice search'}
            </p>
            
            {transcript && (
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  "{transcript}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Text Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Type to search menu items..."
              onChange={(e) => handleTextSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        </div>

        {/* Voice Commands Help */}
        <div className={`mb-6 p-4 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-blue-50'
        }`}>
          <h4 className={`font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Voice Command Examples:
          </h4>
          <ul className={`text-sm space-y-1 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <li>• "Add two chicken biryani"</li>
            <li>• "One paneer butter masala"</li>
            <li>• "Three naan bread"</li>
            <li>• "Add chicken tikka to table five"</li>
          </ul>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h4 className={`font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Search Results ({searchResults.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                } hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h5>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.category} • ₹{item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAddToOrder(item.id, item.name, item.price);
                        speak(`Added ${item.name} to order`);
                      }}
                      className="ml-3 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Multi-language Support Note */}
        <div className={`mt-6 p-3 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Volume2 className="h-4 w-4 inline mr-1" />
            Multi-language support: English, Hindi, Telugu (Browser dependent)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;