import { CATEGORIES, PROPERTY_SUBCATEGORIES } from '../constants/categories';

export const MOCK_USER_PROFILE = {
  id: 'USR-8821',
  name: 'Gyana Prakash',
  phone: '+91 98765 43210',
  email: 'gyana@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  isVerified: true,
  isSubscribed: true,
  subscriptionExpiry: '2026-08-28T14:27:00Z',
  postedAdsCount: 4,
  favoriteAdsIds: ['AD1024', 'AD1026'],
  joinedDate: '2025-11-10',
};

export const MOCK_ADS = [];

export const MOCK_CHATS = [
  {
    id: 'chat-1',
    adId: 'AD1024',
    adTitle: '30x40 Hoskote Corner Plot',
    sellerName: 'Hoskote Realties',
    sellerPhone: '+91 98765 43210',
    unreadCount: 1,
    lastMessage: 'Is this corner plot still available for visit tomorrow?',
    lastMessageTime: '10m ago',
    messages: [
      { id: 'm1', sender: 'seller', text: 'Hello! Thanks for inquiring about the Hoskote plot.', timestamp: '10:30 AM' },
      { id: 'm2', sender: 'buyer', text: 'Hi! Is this corner plot still available for visit tomorrow?', timestamp: '10:32 AM' },
    ],
  },
  {
    id: 'chat-2',
    adId: 'AD1026',
    adTitle: 'Ather 450X Gen 3 Electric Scooter',
    sellerName: 'Vikram Mehta',
    sellerPhone: '+91 98888 77766',
    unreadCount: 0,
    lastMessage: 'Can we negotiate the price slightly for cash payment?',
    lastMessageTime: '2h ago',
    messages: [
      { id: 'm10', sender: 'buyer', text: 'Can we negotiate the price slightly for cash payment?', timestamp: '08:15 AM' },
      { id: 'm11', sender: 'seller', text: 'I can give a ₹3,000 discount if finalized today.', timestamp: '08:20 AM' },
    ],
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Ad Approved! 🎉',
    desc: 'Your listing "30x40 Hoskote Corner Plot" has been reviewed & published live.',
    time: '2 hours ago',
    type: 'ad',
    read: false,
  },
  {
    id: 'notif-2',
    title: '₹100 Subscription Activated!',
    desc: 'You have unlocked 10 days of ad-free access. Valid till 28 Aug 2026.',
    time: '1 day ago',
    type: 'subscription',
    read: true,
  },
  {
    id: 'notif-3',
    title: 'Callback Received',
    desc: 'Ramesh Patel requested a callback regarding your Whitefield property.',
    time: '2 days ago',
    type: 'lead',
    read: true,
  },
];

export const MOCK_BANNERS = [
  {
    id: 'BAN-101',
    title: 'Independence Day Real Estate Mega Expo 2026',
    targetScreen: 'Home Top Carousel',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    destinationUrl: '/categories/layout-sites',
  },
  {
    id: 'BAN-102',
    title: 'Electric Scooter Exchange Fest - Flat ₹10,000 Off',
    targetScreen: 'Scooter Section',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
    destinationUrl: '/categories/electric-scooters',
  },
  {
    id: 'BAN-103',
    title: 'Whitefield Luxury Plots Pre-Launch Special',
    targetScreen: 'Property Feed Banner',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    destinationUrl: '/categories/properties',
  },
];
