import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, 
  Bot, 
  MessageCircle, 
  Zap, 
  Shield, 
  Heart, 
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

const Welcome = () => {
  const { theme, accessibilityMode } = useTheme();
  const { isAuthenticated, userProfile } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const features = [
    {
      icon: Sparkles,
      title: 'Adaptive Intelligence',
      description: 'Our AI learns and adapts to your communication style, creating a truly personalized experience.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: Heart,
      title: 'Human-Centered Design',
      description: 'Built with empathy and understanding, prioritizing your needs and comfort above all.',
      color: 'from-red-400 to-pink-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience instant responses with our optimized AI engine and smart caching system.',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your conversations are protected with enterprise-grade encryption and minimal data retention.',
      color: 'from-blue-400 to-cyan-400'
    }
  ];

  const benefits = [
    '🎯 Context-aware conversations',
    '🌍 Multilingual support',
    '♿ Accessibility features',
    '📱 Cross-device sync',
    '🔒 Privacy protection',
    '⚡ Real-time responses'
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Typing effect for the main headline
  useEffect(() => {
    const headline = "Meet Your Next-Generation AI Companion";
    let index = 0;
    
    const typeWriter = () => {
      if (index < headline.length) {
        setTypedText(headline.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, 100);
      } else {
        setIsTyping(false);
      }
    };

    typeWriter();
  }, []);

  const handleGetStarted = () => {
    // Smooth scroll to features or navigate to chat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Here you could add background music or ambient sounds
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Here you could mute/unmute background sounds
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50 dark:from-neutral-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main headline with typing effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              {typedText}
              {isTyping && (
                <span className="inline-block w-1 h-16 bg-primary-500 ml-2 animate-pulse" />
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of conversational AI with our uniquely intelligent, 
              empathetic, and adaptive chatbot that truly understands you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/chat"
                className="group bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                onClick={handleGetStarted}
              >
                <span>Start Chatting</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold text-lg hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-all duration-300"
              >
                Learn More
              </button>
            </div>

            {/* Audio Controls */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors duration-200 shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors duration-200 shadow-lg"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Floating AI Bot */}
          <div className="relative mt-16">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce-gentle">
              <Bot className="w-16 h-16 text-white" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary-400 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Why Choose Our AI?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Discover the unique features that make our chatbot the most advanced and human-like AI companion available.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === currentFeature;
              
              return (
                <div
                  key={index}
                  className={`
                    relative p-6 rounded-2xl transition-all duration-500 transform
                    ${isActive 
                      ? 'scale-105 bg-gradient-to-br ' + feature.color + ' shadow-xl' 
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:scale-102 hover:shadow-lg'
                    }
                  `}
                >
                  <div className={`
                    w-16 h-16 rounded-2xl mb-4 flex items-center justify-center
                    ${isActive 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-gradient-to-br ' + feature.color
                    }
                  `}>
                    <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-white'}`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${isActive ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'}`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${isActive ? 'text-white/90' : 'text-neutral-600 dark:text-neutral-400'}`}>
                    {feature.description}
                  </p>
                  
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-800 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Built for Humans, Enhanced by AI
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Our chatbot combines cutting-edge artificial intelligence with deep understanding 
                of human needs, creating an experience that feels natural, helpful, and genuinely engaging.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-2xl">{benefit.split(' ')[0]}</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {benefit.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        Hello! I'm here to help you with anything you need. How can I assist you today? 😊
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-primary-500 text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">
                        Hi! I'd love to learn more about your capabilities!
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">U</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who have already discovered the most advanced AI chatbot experience.
          </p>
          
          <Link
            to="/chat"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          {!isAuthenticated && (
            <p className="text-primary-100 mt-4 text-sm">
              No account required • Start chatting instantly
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Welcome;

