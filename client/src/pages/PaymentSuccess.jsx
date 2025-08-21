import React, { useEffect } from 'react';
import { Check, Crown, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main app after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
        <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your membership has been upgraded successfully. You now have access to all premium features!
        </p>
        
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Premium Member</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
        >
          Continue to App
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;