import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, Clock, Users, X, CheckCircle } from 'lucide-react';

interface OnlineReservationProps {
  onClose: () => void;
}

const OnlineReservation: React.FC<OnlineReservationProps> = ({
  onClose
}) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    email: '',
    date: '',
    time: '',
    people: 2,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reservation = {
        ...formData,
        date: new Date(formData.date),
        status: 'pending'
      };
      
      // In a real app, this would save to database
      console.log('Reservation submitted:', reservation);
      setIsSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Reservation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.customerName && formData.customerPhone;
      case 2:
        return formData.date && formData.time;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`max-w-md w-full rounded-2xl p-8 text-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl animate-scale-in`}>
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Reservation Confirmed!
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We've sent a confirmation to your phone and email.
            </p>
          </div>
          
          <div className={`p-4 rounded-xl mb-6 ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Date:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {new Date(formData.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Time:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Party Size:</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.people} people</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full rounded-2xl p-6 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Make a Reservation
          </h2>
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

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= stepNumber
                  ? 'bg-primary text-white'
                  : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  step > stepNumber
                    ? 'bg-primary'
                    : isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-slide-in-right">
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Your Information
              </h3>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/20`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/20`}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/20`}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-in-right">
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Date & Time
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Users className="h-4 w-4 inline mr-2" />
                    Party Size *
                  </label>
                  <select
                    value={formData.people}
                    onChange={(e) => setFormData({...formData, people: Number(e.target.value)})}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/20`}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Clock className="h-4 w-4 inline mr-2" />
                  Preferred Time *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData({...formData, time})}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                        formData.time === time
                          ? 'border-primary bg-primary/10 text-primary'
                          : isDark 
                            ? 'border-gray-600 hover:border-gray-500 text-gray-300' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slide-in-right">
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Special Requests
              </h3>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Any special requests or dietary requirements?
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/20`}
                  placeholder="e.g., Birthday celebration, wheelchair access, allergies..."
                />
              </div>

              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Reservation Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Name:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Phone:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Date:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {formData.date ? new Date(formData.date).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Time:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Party Size:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formData.people} people</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={step === 1 ? onClose : prevStep}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          
          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isStepValid()
                  ? 'bg-primary hover:bg-primary-dark text-white transform hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                isSubmitting
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Confirming...</span>
                </>
              ) : (
                <span>Confirm Reservation</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineReservation;