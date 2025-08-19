// frontend/src/components/auth/Signup.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, Heart, Sparkles, Users, 
  MessageCircle, Gamepad2, Crown, AlertCircle, Loader, 
  CheckCircle, Calendar, MapPin 
} from 'lucide-react';
import { VALIDATION_RULES } from '../../utils/firebase';

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    
    // Step 2: Profile Info
    age: '',
    location: '',
    gender: '',
    interestedIn: '',
    
    // Step 3: Preferences
    relationshipType: '',
    interests: [],
    bio: '',
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();

  const totalSteps = 3;

  const interestOptions = [
    'Gaming', 'Music', 'Movies', 'Sports', 'Travel', 'Cooking', 'Reading',
    'Fitness', 'Art', 'Technology', 'Dancing', 'Photography', 'Hiking',
    'Yoga', 'Meditation', 'Volunteering', 'Fashion', 'Food', 'Pets', 'Cars'
  ];

  const relationshipTypes = [
    'Casual Dating', 'Serious Relationship', 'Marriage', 'Friendship', 'Activity Partner'
  ];

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'interests') {
        setFormData(prev => ({
          ...prev,
          interests: checked 
            ? [...prev.interests, value]
            : prev.interests.filter(interest => interest !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      // Email validation
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!VALIDATION_RULES.email.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      // Name validation
      if (!formData.name) {
        errors.name = 'Name is required';
      } else if (formData.name.length < VALIDATION_RULES.name.minLength) {
        errors.name = `Name must be at least ${VALIDATION_RULES.name.minLength} characters`;
      } else if (formData.name.length > VALIDATION_RULES.name.maxLength) {
        errors.name = `Name must be less than ${VALIDATION_RULES.name.maxLength} characters`;
      }

      // Password validation
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < VALIDATION_RULES.password.minLength) {
        errors.password = `Password must be at least ${VALIDATION_RULES.password.minLength} characters`;
      } else {
        const password = formData.password;
        if (VALIDATION_RULES.password.requireUppercase && !/[A-Z]/.test(password)) {
          errors.password = 'Password must contain at least one uppercase letter';
        } else if (VALIDATION_RULES.password.requireLowercase && !/[a-z]/.test(password)) {
          errors.password = 'Password must contain at least one lowercase letter';
        } else if (VALIDATION_RULES.password.requireNumbers && !/\d/.test(password)) {
          errors.password = 'Password must contain at least one number';
        }
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 2) {
      // Age validation
      if (!formData.age) {
        errors.age = 'Age is required';
      } else if (formData.age < 18 || formData.age > 100) {
        errors.age = 'Age must be between 18 and 100';
      }

      // Location validation
      if (!formData.location) {
        errors.location = 'Location is required';
      }

      // Gender validation
      if (!formData.gender) {
        errors.gender = 'Please select your gender';
      }

      // Interested in validation
      if (!formData.interestedIn) {
        errors.interestedIn = 'Please select who you\'re interested in';
      }
    }

    if (step === 3) {
      // Relationship type validation
      if (!formData.relationshipType) {
        errors.relationshipType = 'Please select what you\'re looking for';
      }

      // Interests validation
      if (formData.interests.length === 0) {
        errors.interests = 'Please select at least one interest';
      }

      // Bio validation
      if (!formData.bio) {
        errors.bio = 'Bio is required';
      } else if (formData.bio.length < VALIDATION_RULES.bio.minLength) {
        errors.bio = `Bio must be at least ${VALIDATION_RULES.bio.minLength} characters`;
      } else if (formData.bio.length > VALIDATION_RULES.bio.maxLength) {
        errors.bio = `Bio must be less than ${VALIDATION_RULES.bio.maxLength} characters`;
      }

      // Terms validation
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the Terms of Service';
      }

      if (!formData.agreeToPrivacy) {
        errors.agreeToPrivacy = 'You must agree to the Privacy Policy';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    try {
      setIsSubmitting(true);
      clearError();
      
      const profileData = {
        name: formData.name,
        age: parseInt(formData.age),
        location: formData.location,
        gender: formData.gender,
        interestedIn: formData.interestedIn,
        relationshipType: formData.relationshipType,
        interests: formData.interests,
        bio: formData.bio,
        profileComplete: true,
        subscribeNewsletter: formData.subscribeNewsletter
      };

      await signup(formData.email, formData.password, profileData);
      navigate('/profile-setup');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Let's get you started with the basics</p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                  } text-white placeholder-gray-400`}
                  placeholder="Enter your full name"
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                  } text-white placeholder-gray-400`}
                  placeholder="Enter your email"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                  } text-white placeholder-gray-400`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                  } text-white placeholder-gray-400`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">About You</h2>
              <p className="text-gray-400">Tell us a bit about yourself</p>
            </div>

            {/* Age and Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      formErrors.age 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                    } text-white placeholder-gray-400`}
                    placeholder="Age"
                  />
                </div>
                {formErrors.age && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.age}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      formErrors.location 
                        ? 'border-red-500 focus: