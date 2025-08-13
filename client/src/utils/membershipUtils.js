export const MEMBERSHIP_TIERS = {
    FREE: 'free',
    GOLD: 'gold',
    PLATINUM: 'platinum',
    DIAMOND: 'diamond'
};

export const MEMBERSHIP_FEATURES = {
    [MEMBERSHIP_TIERS.FREE]: {
        dailyMatches: 5,
        messaging: 'unlimited',
        bingo: false,
        karaoke: false,
        musicFeature: false,
        privateMessaging: true,
        groupMessaging: false,
        videoChat: false,
        profileBoost: false,
        prioritySupport: false,
        advancedFilters:false,
        readReceipts: false,
        events: true,
        discover: true,
        notifications: true
    },
    [MEMBERSHIP_TIERS.GOLD]: {
        dailyMatches: 'unlimited',
        messaging: 'advanced',
        bingo: false,
        karaoke: false,
        musicFeature: false,
        groupMessaging: true,
        videoChat: true,
        videoProfiles: true,
        readReceipts: true,
        customThemes: true
    },
    [MEMBERSHIP_TIERS.PLATINUM]: {
        dailyMatches: 'unlimited',
        messaging: 'unlimited',
        musicFeature: true,
        profileBoost: true,
        invites: true,
        newsletter: true
    },
    [MEMBERSHIP_TIERS.DIAMOND]: {
        flirts: 'unlimited',
        chatRooms: 'unlimited',
        bingo: true,
        karaoke: true,
        feedbackFeature: true,
        fullAccess: 'unlimited'
    }
};

export const PAYPAL_SUBSCRIPTION_LINKS = {
    [MEMBERSHIP_TIERS.GOLD]: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-0j650415FH362491VNAQCFlQ',
    [MEMBERSHIP_TIERS.PLATINUM]: 'https://www.paypal.com/webapps/billing/plans/subscription?plan_id=P-3RG36489BX4272622NAQCKEA',
    [MEMBERSHIP_TIERS.DIAMOND]: 'https://www.paypal.com/webapps/billing/plans/subscription?plan_id=P-33962751K154671RNAQCLQA'
};

export const hasFeaturedAccess = (userMembership, feature) => {
    const membershipFeatures = MEMBERSHIP_FEATURES[userMembership] || MEMBERSHIP_FEATURES[MEMBERSHIP_TIERS.FREE];
    return membershipFeatures[feature] === true || membershipFeatures[feature] === 'unlimited' || membershipFeatures[feature] === 'advanced' || membershipFeatures[feature] === 'premium';
};

export const getFeatureLimit = (userMembership, feature) => {
    const membershipFeatures = MEMBERSHIP_FEATURES[userMembership] || MEMBERSHIP_FEATURES[MEMBERSHIP_TIERS.FREE];
};

export const getMembershipLevel = (membership) => {
    const levels = {
        [MEMBERSHIP_TIERS.FREE]: 0,
        [MEMBERSHIP_TIERS.GOLD]: 1,
        [MEMBERSHIP_TIERS.PLATINUM]: 2,
        [MEMBERSHIP_TIERS.DIAMOND]: 3
    };
    return levels[membership] || 0;
};

export const canAccessFeature = (userMembership, requiredMembership) => {
    return getMembershipLevel(userMembership) > getMembershipLevel(requiredMembership);
};