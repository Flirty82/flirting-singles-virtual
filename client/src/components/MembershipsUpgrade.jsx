import React, { useState, useEffect } from 'react';
import { Crown, Diamond, Check, Star, Heart, Music, Users, Video, MessageCircle, Zap, Shield, Gift } from 'lucide-react';

const MembershipUpgrade = () => {
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    membership: 'free',
    membershipExpiry: null
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, yearly
  const [isLoading, setIsLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Membership plans with features and pricing
  const membershipPlans = {
    gold: {
      name: 'Gold',
      icon: Crown,
      color: 'yellow',
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-400',
      pricing: {
        monthly: 9.99,
        yearly: 99.99
      },
      savings: '17%',
      features: [
        { icon: Heart, text: 'Send & receive unlimited flirts' },
        { icon: Music, text: 'Unlock music sharing features' },
        { icon: MessageCircle, text: 'Enhanced messaging capabilities' },
        { icon: Star, text: 'Priority customer support' },
        { icon: Gift, text: 'Monthly newsletter with dating tips' },
        { icon: Zap, text: 'See who liked your posts' }
      ],
      popular: false
    },
    platinum: {
      name: 'Platinum',
      icon: Crown,
      color: 'gray',
      gradient: 'from-gray-400 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-400',
      pricing: {
        monthly: 19.99,
        yearly: 199.99
      },
      savings: '17%',
      features: [
        { icon: Check, text: 'All Gold features included' },
        { icon: MessageCircle, text: 'Create text posts in activity feed' },
        { icon: Users, text: 'Access to exclusive chat rooms' },
        { icon: Gift, text: 'Send unlimited invites to friends' },
        { icon: Star, text: 'Advanced search filters' },
        { icon: Shield, text: 'Profile boost feature' },
        { icon: Zap, text: 'Priority in recommendations' }
      ],
      popular: true
    },
    diamond: {
      name: 'Diamond',
      icon: Diamond,
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-400',
      pricing: {
        monthly: 29.99,
        yearly: 299.99
      },
      savings: '17%',
      features: [
        { icon: Check, text: 'All Platinum features included' },
        { icon: Video, text: 'Virtual dating experiences' },
        { icon: MessageCircle, text: 'Full unlimited access to activity feed' },
        { icon: Star, text: 'Feedback feature for connections' },
        { icon: Heart, text: 'Exclusive Diamond-only events' },
        { icon: Crown, text: 'VIP customer support' },
        { icon: Zap, text: 'Unlimited super likes' },
        { icon: Shield, text: 'Profile verification badge' }
      ],
      popular: false
    }
  };

  // Load PayPal SDK
  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setPaypalLoaded(true);
        return;
      }

      // Use your actual PayPal Client ID here or set it in your environment
      const clientId = 'YOUR_PAYPAL_CLIENT_ID'; // Replace with your actual client ID
      
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
        alert('PayPal payment system is currently unavailable. Please try again later.');
      };
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  // Render PayPal buttons when plan is selected
  useEffect(() => {
    if (paypalLoaded && selectedPlan) {
      renderPayPalButton();
    }
  }, [paypalLoaded, selectedPlan, billingCycle]);

  const renderPayPalButton = () => {
    if (!window.paypal || !selectedPlan) return;

    const plan = membershipPlans[selectedPlan];
    const amount = plan.pricing[billingCycle];

    // Clear existing PayPal button
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
      paypalContainer.innerHTML = '';
    }

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toString(),
              currency_code: 'USD'
            },
            description: `${plan.name} Membership - ${billingCycle}`
          }]
        });
      },
      onApprove: async (data, actions) => {
        setIsLoading(true);
        try {
          const order = await actions.order.capture();
          await handlePaymentSuccess(order);
        } catch (error) {
          console.error('Payment capture failed:', error);
          alert('Payment processing failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        alert('Payment failed. Please try again.');
        setIsLoading(false);
      },
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 45
      }
    }).render('#paypal-button-container');
  };

  const handlePaymentSuccess = async (order) => {
    try {
      // Send payment data to backend for verification and membership update
      const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your actual API URL
      
      const response = await fetch(`${API_BASE_URL}/payments/verify-paypal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: order.id,
          membershipType: selectedPlan,
          billingCycle: billingCycle,
          paymentDetails: order
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update user membership
        setCurrentUser(prev => ({
          ...prev,
          membership: selectedPlan,
          membershipExpiry: result.membershipExpiry
        }));

        setShowSuccess(true);
        setSelectedPlan(null);

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment successful but verification failed. Please contact support.');
    }
  };

  const getMembershipBadge = (membership) => {
    const plan = membershipPlans[membership];
    if (!plan) return null;

    const IconComponent = plan.icon;
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${plan.gradient} text-white`}>
        <IconComponent className="w-3 h-3" />
        <span>{plan.name}</span>
      </div>
    );
  };

  const getPlanCard = (planKey, plan) => {
    const IconComponent = plan.icon;
    const isCurrentPlan = currentUser.membership === planKey;
    const monthlyPrice = plan.pricing.monthly;
    const yearlyPrice = plan.pricing.yearly;
    const displayPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;
    const billingText = billingCycle === 'monthly' ? '/month' : '/year';

    return (
      <div
        key={planKey}
        className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
          selectedPlan === planKey 
            ? `${plan.borderColor} ring-4 ring-opacity-50 ring-${plan.color}-300` 
            : 'border-gray-200 hover:border-pink-300'
        } ${plan.popular ? 'ring-2 ring-pink-400 ring-opacity-30' : ''}`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              Most Popular
            </span>
          </div>
        )}

        <div className={`p-6 rounded-t-2xl bg-gradient-to-br ${plan.bgGradient}`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.gradient} text-white mb-4 shadow-lg`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-900">${displayPrice}</span>
              <span className="text-gray-600">{billingText}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                  Save {plan.savings}!
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {plan.features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                    <FeatureIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {isCurrentPlan ? (
            <div className="text-center">
              <div className="bg-green-100 text-green-800 py-3 px-4 rounded-xl font-semibold">
                Current Plan
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSelectedPlan(selectedPlan === planKey ? null : planKey)}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedPlan === planKey
                  ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedPlan === planKey ? 'Selected' : 'Select Plan'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-gray-900 py-12 px-4">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Membership upgraded successfully! 🎉</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Upgrade Your Experience
          </h1>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
            Unlock premium features and find your perfect match with our exclusive membership plans
          </p>
          
          {/* Current Membership */}
          <div className="mt-6 inline-flex items-center space-x-3 bg-white/20 backdrop-blur-lg rounded-xl px-6 py-3">
            <span className="text-white font-medium">Current Plan:</span>
            {currentUser.membership === 'free' ? (
              <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold">Free</span>
            ) : (
              getMembershipBadge(currentUser.membership)
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-1">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Membership Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(membershipPlans).map(([planKey, plan]) => 
            getPlanCard(planKey, plan)
          )}
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Upgrade</h3>
              <p className="text-gray-600">
                You selected: <span className="font-semibold">{membershipPlans[selectedPlan].name}</span>
              </p>
              <div className="mt-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${membershipPlans[selectedPlan].pricing[billingCycle]}
                </span>
                <span className="text-gray-600">/{billingCycle.replace('ly', '')}</span>
              </div>
            </div>

            {/* PayPal Button Container */}
            <div id="paypal-button-container" className="mb-4"></div>

            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                  <span>Processing payment...</span>
                </div>
              </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Secure payment powered by PayPal</p>
              <p className="mt-1">Cancel anytime • No hidden fees</p>
            </div>
          </div>
        )}

        {/* Features Comparison */}
        <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-white font-semibold">Features</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Free</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Gold</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Platinum</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Diamond</th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Unlimited Messaging</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Send Flirts</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Create Posts</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Virtual Dating</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipUpgrade;