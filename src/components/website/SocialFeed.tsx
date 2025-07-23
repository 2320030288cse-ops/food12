import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Instagram, Heart, MessageCircle, Share2, Star } from 'lucide-react';

const SocialFeed: React.FC = () => {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([
    {
      id: 1,
      image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Our signature Chicken Tikka Masala - a customer favorite! 🔥',
      likes: 234,
      comments: 18,
      username: 'gsrestaurant',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Fresh ingredients, authentic flavors. That\'s our promise! 🌿',
      likes: 189,
      comments: 12,
      username: 'gsrestaurant',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/4772874/pexels-photo-4772874.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Sweet endings to perfect meals 🍮✨',
      likes: 156,
      comments: 8,
      username: 'gsrestaurant',
      timestamp: '1 day ago'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400',
      caption: 'Cozy ambiance for memorable dining experiences 🕯️',
      likes: 298,
      comments: 25,
      username: 'gsrestaurant',
      timestamp: '2 days ago'
    }
  ]);

  const [reviews] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Absolutely amazing food and service! The Butter Chicken was incredible.',
      date: '3 days ago',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Best restaurant in the city! Great ambiance and delicious food.',
      date: '1 week ago',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      name: 'Anita Patel',
      rating: 4,
      comment: 'Loved the vegetarian options. Will definitely come back!',
      date: '2 weeks ago',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]);

  return (
    <section className={`py-20 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Social <span className="gradient-text">Buzz</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            See what our customers are saying and sharing about their experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Instagram Feed */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  @gsrestaurant
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Follow us for daily food inspiration
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <div key={post.id} className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="relative group">
                    <img
                      src={post.image}
                      alt="Instagram post"
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-5 w-5" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-5 w-5" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {post.timestamp}
                      </span>
                      <div className="flex items-center space-x-3">
                        <button className="text-red-500 hover:text-red-600 transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className={`${
                          isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                        } transition-colors`}>
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Follow @gsrestaurant
              </button>
            </div>
          </div>

          {/* Customer Reviews */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Customer Reviews
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  What our guests are saying
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-start space-x-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {review.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={`${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      } mb-2`}>
                        "{review.comment}"
                      </p>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;