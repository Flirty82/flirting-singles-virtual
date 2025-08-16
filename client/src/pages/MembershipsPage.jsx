import React from 'react';

const MembershipsPage = () => {
  const memberships = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Basic profile creation',
        'Limited daily matches (5)',
        'Basic messaging',
        'Access to activity feed',
        'Community chat rooms'
      ],
      className: 'free',
      popular: false
    },
    {
      name: 'Gold',
      price: '$9.99',
      period: '/month',
      features: [
        'Everything in Free',
        'Unlimited daily matches',
        'Advanced filters',
        'Private messaging',
        'Virtual bingo access',
        'Music feature access',
        'Read receipts'
      ],
      className: 'gold',
      popular: true
    },
    {
      name: 'Platinum',
      price: '$19.99',
      period: '/month',
      features: [
        'Everything in Gold',
        'Virtual karaoke access',
        'Priority support',
        'Advanced privacy controls',
        'Group messaging',
        'Profile boost feature',
        'Video chat access'
      ],
      className: 'platinum',
      popular: false
    },
    {
      name: 'Diamond',
      price: '$29.99',
      period: '/month',
      features: [
        'Everything in Platinum',
        'VIP profile status',
        'Exclusive events access',
        'Personal matchmaking',
        'Advanced analytics',
        'Custom profile themes',
        '24/7 concierge support'
      ],
      className: 'diamond',
      popular: false
    }
  ];

  return (
    <div className="container">
      <div className="memberships-header">
        <h1>Choose Your Membership</h1>
        <p>Unlock premium features and find your perfect match faster</p>
      </div>
      
      <div className="membership-grid">
        {memberships.map((membership, index) => (
          <div key={index} className={`membership-card ${membership.className} ${membership.popular ? 'popular' : ''}`}>
            {membership.popular && <div className="popular-badge">Most Popular</div>}
            <h3 className="membership-title">{membership.name}</h3>
            <div className="membership-price">
              <span className="price">{membership.price}</span>
              <span className="period">{membership.period}</span>
            </div>
            <ul className="feature-list">
              {membership.features.map((feature, featureIndex) => (
                <li key={featureIndex}>✓ {feature}</li>
              ))}
            </ul>
            <button className="btn btn-primary full-width">
              {membership.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};