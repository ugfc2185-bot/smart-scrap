// ============================================================
// SMARTSCRAP - Mock Data Store (simulates database)
// ============================================================

export const WASTE_CATEGORIES = [
  { id: 1, name: 'Plastic', points_per_kg: 10, icon: '🧴', color: '#3B82F6', description: 'Bottles, bags, containers' },
  { id: 2, name: 'Paper', points_per_kg: 5, icon: '📄', color: '#F59E0B', description: 'Newspapers, books, cardboard' },
  { id: 3, name: 'Metal', points_per_kg: 20, icon: '🔩', color: '#6B7280', description: 'Cans, tins, scrap metal' },
  { id: 4, name: 'E-Waste', points_per_kg: 30, icon: '💻', color: '#8B5CF6', description: 'Electronics, batteries' },
  { id: 5, name: 'Glass', points_per_kg: 8, icon: '🍶', color: '#06B6D4', description: 'Bottles, jars' },
  { id: 6, name: 'Cardboard', points_per_kg: 6, icon: '📦', color: '#D97706', description: 'Boxes, packaging' },
  { id: 7, name: 'Clothes', points_per_kg: 12, icon: '👕', color: '#EC4899', description: 'Textiles, fabric' },
  { id: 8, name: 'Organic', points_per_kg: 3, icon: '🌿', color: '#22C55E', description: 'Food waste, garden waste' },
  { id: 9, name: 'Mixed Scrap', points_per_kg: 7, icon: '♻️', color: '#16A34A', description: 'Mixed recyclable items' },
];

export const REWARDS = [
  { id: 1, name: '₹50 Amazon Voucher', description: 'Shop anything on Amazon India', points_required: 250, cash_value: 50, image: '🛒', category: 'Shopping' },
  { id: 2, name: '₹100 Shopping Voucher', description: 'Valid at major retail stores', points_required: 500, cash_value: 100, image: '🏪', category: 'Shopping' },
  { id: 3, name: '₹200 Grocery Voucher', description: 'BigBasket or Grofers', points_required: 1000, cash_value: 200, image: '🛍️', category: 'Grocery' },
  { id: 4, name: 'Plant a Tree 🌱', description: 'We plant a tree in your name', points_required: 300, cash_value: 0, image: '🌳', category: 'Environment' },
  { id: 5, name: 'Food Coupon', description: 'Zomato or Swiggy discount', points_required: 500, cash_value: 100, image: '🍔', category: 'Food' },
  { id: 6, name: '₹500 Cashback', description: 'Direct bank transfer', points_required: 2500, cash_value: 500, image: '💰', category: 'Cash' },
];

export const DEMO_USERS = {
  'user@smartscrap.com': {
    id: 1, name: 'Rahul Sharma', email: 'user@smartscrap.com', password: 'User@123', role: 'user',
    phone: '9876543210', address: '12, Green Park Colony', city: 'Mumbai', pincode: '400001',
    latitude: 19.0760, longitude: 72.8777,
    wallet: { balance: 1245, total_earned: 1850, total_redeemed: 605 },
  },
  'collector@smartscrap.com': {
    id: 2, name: 'Amit Kumar', email: 'collector@smartscrap.com', password: 'Collector@123', role: 'collector',
    phone: '9123456789', vehicle_type: 'Bike', vehicle_number: 'MH12AB1234', license_number: 'MH2020123456',
    latitude: 19.0850, longitude: 72.8900, rating: 4.8, status: 'active',
  },
  'admin@smartscrap.com': {
    id: 3, name: 'Admin User', email: 'admin@smartscrap.com', password: 'Admin@123', role: 'admin',
  },
};

export const DEMO_PICKUPS = [
  {
    id: 1, pickup_code: 'SSP-2026-000121', user_id: 1, collector_id: 2,
    collector_name: 'Amit Kumar', address: '12, Green Park Colony, Mumbai', city: 'Mumbai',
    scheduled_date: '2026-10-01', time_slot: '9 AM – 12 PM',
    status: 'completed', estimated_weight: 10, actual_weight: 9.8,
    estimated_points: 95, final_points: 93,
    items: [
      { category: 'Plastic', estimated: 5, actual: 4.5, points: 45 },
      { category: 'Paper', estimated: 3, actual: 3.2, points: 16 },
      { category: 'Metal', estimated: 2, actual: 2.1, points: 42 },
    ],
    created_at: '2026-10-01T08:00:00Z', completed_at: '2026-10-01T10:30:00Z',
  },
  {
    id: 2, pickup_code: 'SSP-2026-000118', user_id: 1, collector_id: 2,
    collector_name: 'Rohit Singh', address: '12, Green Park Colony, Mumbai',
    scheduled_date: '2026-09-25', time_slot: '12 PM – 3 PM',
    status: 'completed', estimated_weight: 8, actual_weight: 7.6,
    estimated_points: 75, final_points: 72,
    items: [
      { category: 'E-Waste', estimated: 2, actual: 1.8, points: 54 },
      { category: 'Glass', estimated: 3, actual: 3.0, points: 24 },
      { category: 'Cardboard', estimated: 3, actual: 2.8, points: 17 },
    ],
    created_at: '2026-09-25T11:00:00Z', completed_at: '2026-09-25T13:00:00Z',
  },
];

export const DEMO_NOTIFICATIONS = [
  { id: 1, title: 'Pickup Completed!', message: 'Your pickup SSP-2026-000121 was completed. You earned 93 points!', type: 'success', is_read: false, created_at: '2026-10-01T10:30:00Z' },
  { id: 2, title: 'Collector Assigned', message: 'Amit Kumar has accepted your pickup SSP-2026-000118.', type: 'info', is_read: true, created_at: '2026-09-25T11:10:00Z' },
  { id: 3, title: 'Reward Redeemed', message: 'Your ₹50 Amazon Voucher is being processed.', type: 'success', is_read: true, created_at: '2026-09-20T14:00:00Z' },
];

export const DEMO_POINT_TRANSACTIONS = [
  { id: 1, pickup_code: 'SSP-2026-000121', points: 93, type: 'earned', description: 'Plastic, Paper, Metal recycled', created_at: '2026-10-01T10:30:00Z' },
  { id: 2, pickup_code: 'SSP-2026-000118', points: 72, type: 'earned', description: 'E-Waste, Glass, Cardboard recycled', created_at: '2026-09-25T13:00:00Z' },
  { id: 3, pickup_code: null, points: -250, type: 'redeemed', description: '₹50 Amazon Voucher', created_at: '2026-09-20T14:00:00Z' },
  { id: 4, pickup_code: null, points: -355, type: 'redeemed', description: '₹100 Shopping Voucher + Plant a Tree', created_at: '2026-09-15T10:00:00Z' },
];

export const ADMIN_STATS = {
  total_users: 10245, total_collectors: 524, total_pickups: 25430,
  active_pickups: 18, kg_recycled: 85430, points_distributed: 1245600,
};

export const COLLECTOR_DEMO_REQUESTS = [
  {
    id: 100, pickup_code: 'SSP-2026-000124', user_name: 'Priya Patel', user_phone: '9988776655',
    address: '45, Andheri East, Mumbai', distance: '2.4 km',
    scheduled_date: '2026-10-06', time_slot: '3 PM – 6 PM',
    items: [
      { category: 'Plastic', estimated: 5, category_id: 1 },
      { category: 'Paper', estimated: 3, category_id: 2 },
      { category: 'Metal', estimated: 2, category_id: 3 },
    ],
    estimated_weight: 10, estimated_points: 105, status: 'requested',
    latitude: 19.0900, longitude: 72.8500,
  },
];
