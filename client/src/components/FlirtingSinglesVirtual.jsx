import React, { useState } from 'react';
import { Heart, Users, Star, Diamond, Crown, Mail, Phone, MapPin, User, Lock, Eye, EyeOff, Check, X } from 'lucide-react';

const FlirtingSinglesVirtual = () => {
    const [currentPage, setCurrentPage] = useState('welcome');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigation = [
        { id: 'welcome', label: 'Home', icon: Heart },
        { id: 'membership', label: 'Memberships', icon: Crown },
        { id: 'contact', label: 'Contact us', icon: Mail },
        { id: 'login', label: 'Login', icon: User },
        { id: 'signup', label: 'Sign Up', icon: Users },
    ];

    const renderPage = () => {
        switch (currentPage) {
            case 'welcome':
                return <WelcomePage/>;
            case 'membership':
                return <Memberships/>;
            case 'contact':
                return <ContactUs/>;
            case 'login':
                return <LoginPage setIsLoggedIn={setIsLoggedIn}/>;
            case 'signup':
                return <SignupPage setIsLoggedIn={setIsLoggedIn}/>;
            default:
                return <HomePage/>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
            {/*Navigation*/}
            <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-pink-500"/>
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Flirting Singles
                        </span>
                    </div>

                    <div className="flex space-x-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                   key={item.id}
                                   onClick={() => setCurrentPage(item.id)}
                                   className={'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ow-lg'}
                            >
                                <Icon className="h-4 w-4"/>
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
        
                            );
                        })}
                    </div>
                </div>
               </div>
            </nav>

            {/*Page Content*/}
            <main className="flex-1">
                {renderPage()}
            </main>

            {/*Footer*/}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <Heart className="h-8 w-8 text-pink-500"/>
                                <span className="text-2xl font-bold">Flirting Singles</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Connecting hearts and building meaningful relationships in the digital age.
                            </p>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-pink-500 transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors">Help Center</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text gray-400 hover:text-pink-500 transition-colors">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">f</div>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">t</div>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">i</div>
                        </a>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Flirting Singles. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};