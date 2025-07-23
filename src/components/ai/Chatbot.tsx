const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, restaurantInfo }) => {
            {messages.length === 0 && (
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  👋 Welcome to {restaurantInfo?.name || 'GS Restaurant'}! I'm here to help you with:
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <li>• Menu recommendations</li>
                  <li>• Table reservations</li>
                  <li>• Hours and location</li>
                  <li>• Special dietary needs</li>
                  <li>• Contact information</li>
                </ul>
                
                {restaurantInfo && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{restaurantInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{restaurantInfo.hours.weekdays}</span>
                    </div>
                  </div>
                )}
              </div>
            )}