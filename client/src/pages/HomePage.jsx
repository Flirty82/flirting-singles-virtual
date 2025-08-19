import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, MessageCircle } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="max-w-6xl mx-auto">
            <section className="text-center py-20">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                    Find your perfect match!
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Join thousands of singles looking for love and companionship.</p>
                    <Link 
                      to="flirting-singles-virtual/client/src/pages/SignUpPage.jsx"
                      className="bg-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-600 transition-colors"
                        >
                            Sign Up Now!
                        </Link>
            </section>

            <section className="grid md:grid-cols-3 gap-8 py-16">
                <div className="text-center p-6">
                    <Heart className="w-12 h=12 text-rose-500 mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold mb-2">Discover Singles</h3>
                    <p className="text-gray-600">
                        Browse through profiles of singles near and far.
                    </p>
                </div>
                <div className="text-center p-6">
                    <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4"
                />
                   <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                   <p>Your privacy and security are one of our top priorities</p>
        </div>
        <div className="text-center p-6">
            <MessageCircle className="w-12 h-12 text-rose-500 mx-auto mb-4"/>
            <h3 className="text-xl font-semibold mb-2">Real Connections...Real People</h3>
            <p className="text-gray-600">
                Connect with genuine people!
            </p>
        </div>
    </section>

    <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Membership Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Free</h3>
                <p className="text-3xl font-bold mb-4">$0<span className="text-lg text-gray-500">/month</span></p>
                <ul className="space-y-2 mb-8">
                    <li>Create a profile</li>
                    <li>Upload/share photos</li>
                    <li>Send/receive messages unlimited</li>
                    <li>24/7 Support</li>
                    <li>Browse other singles unlimited</li>
                    <li>Free online dating safety booklet</li>
                    <li>Activity Feed view only</li>
                </ul>
                <Link
                  to="flirting-singles-virtual/client/src/pages/register.jsx"
                  className="block text-center bg-gray-100 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-200"
                >
                    Get Started
                </Link>
            </div>

            <div className="bg-rose-500 p-8 rounded-lg shadow-md transform scale-105">
                <div className="absolute-top-4 left-1/2 transform-translate-x-1/2">
                <span className="bg-rose-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                    </span></div>
                    <h3 className="text-xl font-semibold mb-4">Gold</h3>
                    <p className="text-3xl font-bold mb-4">$25<span className="text-lg text-gray-500">/month</span></p>
                    <ul className="space-y-2 mb-8">
                        <li>Benefits from free membership</li>
                        <li>Upload/share videos unlimited</li>
                        <li>Monthly newsletter</li>
                        <li>Video profiles</li>
                        <li>Music feature</li>
                        <li>Advanced filters</li>
                        <li>Read receipts</li>
                        <li>Profile highlighting</li>
                        <li>Profile boosts</li>
                    </ul>
                    <Link
                      to="/flirting-singles-virtual/client/src/pages/register.jsx"
                      className="block text-center bg-gray-100 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-200"
                         >
                            Gold Membership
                         </Link>
            </div>
        </div>
    </section>
</div>
    );
}