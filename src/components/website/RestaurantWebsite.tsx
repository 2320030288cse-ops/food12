import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import GSLogo from '../common/GSLogo';
import AIPersonalization from '../ai/AIPersonalization';
import OnlineReservation from './OnlineReservation';
import OnlineOrdering from './OnlineOrdering';
import Chatbot from '../ai/Chatbot';
import SocialFeed from './SocialFeed';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Filter,
  Search,
  Heart,
  Share2,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  ChefHat,
  Award,
  Leaf,
  Zap
} from 'lucide-react';

const RestaurantWebsite: React.FC = () => {
  const { menuItems, addReservation } = useData();
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [showReservation, setShowReservation] = useState(false);
  const [showOrdering, setShowOrdering] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [personalizedMenu, setPersonalizedMenu] = useState(menuItems);
  const [userPreferences, setUserPreferences] = useState({
    dietary: 'all',
    spiceLevel: 'medium',
    visitTime: 'dinner',
    favoriteCategories: []
  });

  useEffect(() => {
    // AI-powered menu personalization based on time and preferences
    const currentHour = new Date().getHours();
    let timeBasedMenu = menuItems;

    if (currentHour < 12) {
      // Morning - prioritize breakfast items
      timeBasedMenu = menuItems.filter(item => 
        item.category.toLowerCase().includes('breakfast') || 
        item.category.toLowerCase().includes('beverage')
      ).concat(menuItems.filter(item => 
        !item.category.toLowerCase().includes('breakfast')
      ));
    } else if (currentHour < 17) {
      // Afternoon - prioritize lunch items
      timeBasedMenu = menuItems.filter(item => 
        item.category.toLowerCase().includes('main') || 
        item.category.toLowerCase().includes('starter')
      ).concat(menuItems.filter(item => 
        !item.category.toLowerCase().includes('main')
      ));
    }

    setPersonalizedMenu(timeBasedMenu);
  }, [menuItems, userPreferences]);

  const filteredMenu = personalizedMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDietary = dietaryFilter === 'all' || 
                          (dietaryFilter === 'veg' && item.dietary_info?.includes('vegetarian')) ||
                          (dietaryFilter === 'vegan' && item.dietary_info?.includes('vegan')) ||
                          (dietaryFilter === 'gluten-free' && item.dietary_info?.includes('gluten-free'));
    return matchesSearch && matchesDietary && item.available;
  });

  const specialItems = menuItems.filter(item => item.isSpecial && item.available);
  const categories = [...new Set(menuItems.map(item => item.category))];

  const restaurantInfo = {
    name: "GS Restaurant",
    address: "123 Gourmet Street, Food District, City 560001",
    phone: "+91 98765 43210",
    email: "hello@gsrestaurant.com",
    hours: {
      weekdays: "11:00 AM - 11:00 PM",
      weekends: "10:00 AM - 12:00 AM"
    },
    socialMedia: {
      instagram: "@gsrestaurant",
      facebook: "GS Restaurant",
      twitter: "@gsrestaurant"
    }
  };

  const heroImages = [
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ];

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Navigation Header */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/95 backdrop-blur-md border-gray-800' 
          : 'bg-white/95 backdrop-blur-md border-gray-200'
      } border-b shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GSLogo size="md" animated />
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {restaurantInfo.name}
                </h1>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Fine Dining Experience
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['home', 'menu', 'about', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === section
                      ? 'text-primary border-b-2 border-primary'
                      : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowReservation(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Reserve
              </button>
              <button
                onClick={() => setShowOrdering(true)}
                className="bg-secondary hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <ShoppingBag className="h-4 w-4 inline mr-2" />
                Order
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImages[currentHeroImage]}
            alt="Restaurant ambiance"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-8 animate-fade-in">
            <GSLogo size="xl" animated className="mx-auto mb-6" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Welcome to <span className="gradient-text">GS Restaurant</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            Experience culinary excellence with our authentic flavors and warm hospitality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => setShowReservation(true)}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Calendar className="h-5 w-5 inline mr-2" />
              Make Reservation
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 border border-white/30"
            >
              View Menu
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* AI Personalization Banner */}
      <AIPersonalization 
        userPreferences={userPreferences}
        onPreferencesUpdate={setUserPreferences}
      />

      {/* Menu Section */}
      <section id="menu" className={`py-20 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Our <span className="gradient-text">Menu</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our carefully crafted dishes made with the finest ingredients and authentic recipes
            </p>
          </div>

          {/* Menu Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search dishes, ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:scale-105 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-lg`}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-4 focus:ring-primary/20 shadow-lg`}
              >
                <option value="all">All Dietary</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
              
              <button
                onClick={() => setShowOrdering(true)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="h-5 w-5 inline mr-2" />
                Order Online
              </button>
            </div>
          </div>

          {/* Special Items Carousel */}
          {specialItems.length > 0 && (
            <div className="mb-16">
              <h3 className={`text-2xl font-bold mb-8 text-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <Star className="h-6 w-6 inline mr-2 text-yellow-500" />
                Today's Specials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specialItems.slice(0, 3).map((item) => (
                  <div key={item.id} className={`group rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    isDark ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={item.name}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 animate-pulse">
                        <Star className="h-4 w-4 fill-current" />
                        <span>Special</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2">
                        <Heart className="h-5 w-5 text-white hover:text-red-500 transition-colors cursor-pointer" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className={`text-xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h4>
                      <p className={`text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold text-primary`}>
                          ₹{item.price}
                        </span>
                        <div className="flex items-center space-x-2">
                          {item.dietary_info?.includes('vegetarian') && (
                            <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Leaf className="h-2 w-2 text-white" />
                            </span>
                          )}
                          {item.isSpecial && (
                            <span className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Zap className="h-2 w-2 text-white" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const categoryItems = filteredMenu.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="space-y-6">
                  <h3 className={`text-2xl font-bold text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <div key={item.id} className={`group rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                      } border border-gray-200 dark:border-gray-600`}>
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className={`font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </h4>
                              <span className="text-primary font-bold">
                                ₹{item.price}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                {item.dietary_info?.includes('vegetarian') && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Veg
                                  </span>
                                )}
                                {item.isSpecial && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    Special
                                  </span>
                                )}
                              </div>
                              <button className="text-primary hover:text-primary-dark transition-colors">
                                <Heart className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className={`text-4xl md:text-5xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Our <span className="gradient-text">Story</span>
              </h2>
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                At GS Restaurant, we believe that great food brings people together. Our journey began with a simple vision: to create authentic, flavorful dishes that celebrate the rich culinary traditions while embracing modern innovation.
              </p>
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Every dish is crafted with passion, using the finest ingredients sourced from local farmers and trusted suppliers. Our experienced chefs combine traditional techniques with contemporary presentation to deliver an unforgettable dining experience.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Signature Dishes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Happy Customers
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Restaurant interior"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8" />
                  <div>
                    <div className="font-bold">Award Winning</div>
                    <div className="text-sm opacity-90">Best Restaurant 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Visit <span className="gradient-text">Us</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We're here to serve you with exceptional food and warm hospitality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className={`p-8 rounded-2xl ${
                isDark ? 'bg-gray-700' : 'bg-white'
              } shadow-xl`}>
                <h3 className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Address
                      </h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {restaurantInfo.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Phone
                      </h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {restaurantInfo.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Opening Hours
                      </h4>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Mon-Fri: {restaurantInfo.hours.weekdays}
                      </p>
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Sat-Sun: {restaurantInfo.hours.weekends}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-600">
                  <h4 className={`font-semibold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Follow Us
                  </h4>
                  <div className="flex space-x-4">
                    <a href="#" className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:scale-110 transition-transform">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="p-3 bg-blue-600 text-white rounded-xl hover:scale-110 transition-transform">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="p-3 bg-blue-400 text-white rounded-xl hover:scale-110 transition-transform">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-2xl ${
              isDark ? 'bg-gray-700' : 'bg-white'
            } shadow-xl`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Interactive Map
              </h3>
              <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Interactive map would be embedded here
                  </p>
                  <button className="mt-4 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Feed Section */}
      <SocialFeed />

      {/* Online Reservation Modal */}
      {showReservation && (
        <OnlineReservation
          onClose={() => setShowReservation(false)}
          onReservationSubmit={addReservation}
        />
      )}

      {/* Online Ordering Modal */}
      {showOrdering && (
        <OnlineOrdering
          onClose={() => setShowOrdering(false)}
          menuItems={filteredMenu}
        />
      )}

      {/* Chatbot */}
      <Chatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        restaurantInfo={restaurantInfo}
      />

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 animate-float"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-6 left-6 flex flex-col space-y-3 z-40">
        <button
          onClick={() => setShowReservation(true)}
          className="bg-secondary hover:bg-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-float"
          style={{ animationDelay: '1s' }}
        >
          <Calendar className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowOrdering(true)}
          className="bg-accent hover:bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-float"
          style={{ animationDelay: '2s' }}
        >
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default RestaurantWebsite;