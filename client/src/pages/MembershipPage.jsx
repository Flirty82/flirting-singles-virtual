const MembershipPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('gold');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Forever',
      color: 'from-gray-400 to-gray-600',
      icon: Heart,
      features: [
        'Basic profile creation',
        '5 matches per day',
        'Unlimited messaging',
        'Basic search filters',
        'Profile views (last 5)',
        'Community forum limited access',
        'Upload/share photos unlimited',
        '24/7 support'
      ],
      limitations: [
        'No advanced filters',
        'No read receipts',
        'Standard support'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '$20',
      period: 'per month',
      color: 'from-yellow-400 to-yellow-600',
      icon: Star,
      popular: true,
      features: [
        'Enhanced profile features',
        'Unlimited matches',
        'Advanced messaging',
        'Advanced search filters',
        'Profile views (unlimited)',
        'Read receipts',
        'Priority customer support',
        'Boost your profile 2x/month',
        'Send/receive flirts unlimited',
        'Upload/share videos unlimited',
        'Video profiles',
        'Match suggestions based on AI'
      ],
      limitations: [
        'Standard profile boost',
        'Limited super likes'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '$30',
      period: 'per month',
      color: 'from-purple-400 to-purple-600',
      icon: Crown,
      features: [
        'Everything in Gold',
        'Super likes (10/day)',
        'Profile boost 5x/month',
        'Message before matching',
        'See who likes you',
        'Priority in search results',
        'VIP customer support',
        'Advanced analytics',
        'Full access to activity feed',
        'Chat rooms unlimited access',
        'Music feature',
        'Send/receive invites unlimited',
        'Newsletter access'
      ],
      limitations: [
        'Standard video calls'
      ]
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: '$50',
      period: 'per month',
      color: 'from-cyan-400 to-blue-600',
      icon: Diamond,
      features: [
        'Everything in Platinum',
        'Unlimited super likes',
        'Profile boost 10x/month',
        'Video calls',
        'Travel mode',
        'Personal matchmaker',
        'White-glove support',
        'Exclusive events access',
        'Advanced privacy controls',
        'Full unlimited access to all features',
        'Full feedback feature',
        'Virtual Bingo',
        'Virtual paranormal activity',
        'Virtual karaoke',
        'Virutal Movie night',
        'Virtual casino nights',
        'First access to new features before release'
      ],
      limitations: []
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">Find the perfect membership plan that suits your dating goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className={`bg-gradient-to-r ${plan.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.price === '$0' ? 'Get Started' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Plan Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6">Features</th>
                  <th className="text-center py-4 px-6">Free</th>
                  <th className="text-center py-4 px-6">Gold</th>
                  <th className="text-center py-4 px-6">Platinum</th>
                  <th className="text-center py-4 px-6">Diamond</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Daily Matches', free: '5', gold: 'Unlimited', platinum: 'Unlimited', diamond: 'Unlimited' },
                  { feature: 'Super Likes', free: '1', gold: '3', platinum: '10', diamond: 'Unlimited' },
                  { feature: 'Profile Boosts', free: '0', gold: '2/month', platinum: '5/month', diamond: '10/month' },
                  { feature: 'Read Receipts', free: '✗', gold: '✓', platinum: '✓', diamond: '✓' },
                  { feature: 'Video Calls', free: '✗', gold: '✗', platinum: '✗', diamond: '✓' },
                  { feature: 'Personal Matchmaker', free: '✗', gold: '✗', platinum: '✗', diamond: '✓' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center">{row.free}</td>
                    <td className="py-4 px-6 text-center">{row.gold}</td>
                    <td className="py-4 px-6 text-center">{row.platinum}</td>
                    <td className="py-4 px-6 text-center">{row.diamond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
