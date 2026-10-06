'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, DEMO_PICKUPS, DEMO_NOTIFICATIONS, DEMO_POINT_TRANSACTIONS, COLLECTOR_DEMO_REQUESTS } from '@/lib/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pickups, setPickups] = useState(DEMO_PICKUPS);
  const [collectorRequests, setCollectorRequests] = useState(COLLECTOR_DEMO_REQUESTS);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [pointTransactions, setPointTransactions] = useState(DEMO_POINT_TRANSACTIONS);
  const [wallet, setWallet] = useState({ balance: 1245, total_earned: 1850, total_redeemed: 605 });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartscrap_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = (email, password, role) => {
    const u = DEMO_USERS[email];
    if (!u || u.password !== password || u.role !== role) {
      return { success: false, error: 'Invalid email, password, or role.' };
    }
    const sessionUser = { ...u, password: undefined };
    setUser(sessionUser);
    localStorage.setItem('smartscrap_user', JSON.stringify(sessionUser));
    if (u.role === 'user') {
      setWallet(u.wallet || { balance: 1245, total_earned: 1850, total_redeemed: 605 });
    }
    return { success: true, user: sessionUser };
  };

  const register = (formData) => {
    const newUser = { ...formData, id: Date.now(), role: formData.role || 'user' };
    const sessionUser = { ...newUser, password: undefined };
    setUser(sessionUser);
    localStorage.setItem('smartscrap_user', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartscrap_user');
  };

  const schedulePickup = (pickupData) => {
    const code = `SSP-2026-${String(Math.floor(100000 + Math.random() * 900000)).slice(0,6)}`;
    const newPickup = {
      id: Date.now(),
      pickup_code: code,
      user_id: user?.id,
      status: 'requested',
      created_at: new Date().toISOString(),
      ...pickupData,
    };
    setPickups(prev => [newPickup, ...prev]);
    // Also add to collector requests
    setCollectorRequests(prev => [{
      id: newPickup.id,
      pickup_code: code,
      user_name: user?.name || 'Unknown User',
      user_phone: user?.phone || '9999999999',
      address: pickupData.address,
      distance: `${(Math.random() * 4 + 0.5).toFixed(1)} km`,
      scheduled_date: pickupData.scheduled_date,
      time_slot: pickupData.time_slot,
      items: pickupData.items,
      estimated_weight: pickupData.estimated_weight,
      estimated_points: pickupData.estimated_points,
      status: 'requested',
      latitude: 19.08 + Math.random() * 0.05,
      longitude: 72.88 + Math.random() * 0.05,
    }, ...prev]);
    addNotification('Pickup Scheduled!', `Your pickup ${code} has been scheduled successfully.`, 'success');
    return { success: true, pickup_code: code };
  };

  const acceptPickup = (pickupId) => {
    setPickups(prev => prev.map(p =>
      p.id === pickupId ? { ...p, status: 'assigned', collector_id: 2, collector_name: 'Amit Kumar' } : p
    ));
    setCollectorRequests(prev => prev.map(r =>
      r.id === pickupId ? { ...r, status: 'assigned' } : r
    ));
    addNotification('Collector Assigned!', 'Amit Kumar has accepted your pickup. He will arrive soon.', 'info');
  };

  const rejectPickup = (pickupId) => {
    setCollectorRequests(prev => prev.filter(r => r.id !== pickupId));
  };

  const updatePickupStatus = (pickupId, status) => {
    setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, status } : p));
    const msgs = {
      'on_the_way': ['Collector On The Way', 'Your collector is on the way to your location!'],
      'arrived': ['Collector Arrived', 'Your collector has arrived at your location.'],
      'in_progress': ['Pickup In Progress', 'The scrap collection is in progress.'],
      'completed': ['Pickup Completed!', 'Your pickup is complete. Points have been added to your wallet.'],
    };
    if (msgs[status]) addNotification(msgs[status][0], msgs[status][1], status === 'completed' ? 'success' : 'info');
  };

  const completePickup = (pickupId, actualItems, finalPoints) => {
    const completedAt = new Date().toISOString();
    setPickups(prev => prev.map(p =>
      p.id === pickupId ? {
        ...p, status: 'completed', actual_items: actualItems,
        final_points: finalPoints, completed_at: completedAt,
        actual_weight: actualItems.reduce((s, i) => s + i.actual, 0),
      } : p
    ));
    // Add points to wallet
    setWallet(prev => ({
      balance: prev.balance + finalPoints,
      total_earned: prev.total_earned + finalPoints,
      total_redeemed: prev.total_redeemed,
    }));
    // Add point transaction
    const pickup = pickups.find(p => p.id === pickupId);
    setPointTransactions(prev => [{
      id: Date.now(), pickup_code: pickup?.pickup_code,
      points: finalPoints, type: 'earned',
      description: actualItems.map(i => i.category).join(', ') + ' recycled',
      created_at: completedAt,
    }, ...prev]);
    addNotification('You Earned Points! 🎉', `Pickup complete! You earned ${finalPoints} points. Check your wallet.`, 'success');
  };

  const redeemReward = (reward) => {
    if (wallet.balance < reward.points_required) {
      return { success: false, error: `You need ${reward.points_required} points to redeem this reward.` };
    }
    setWallet(prev => ({
      balance: prev.balance - reward.points_required,
      total_earned: prev.total_earned,
      total_redeemed: prev.total_redeemed + reward.points_required,
    }));
    setPointTransactions(prev => [{
      id: Date.now(), pickup_code: null,
      points: -reward.points_required, type: 'redeemed',
      description: reward.name,
      created_at: new Date().toISOString(),
    }, ...prev]);
    addNotification('Reward Redeemed! 🎁', `${reward.name} redemption is being processed. Check your email.`, 'success');
    return { success: true };
  };

  const addNotification = (title, message, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now(), title, message, type, is_read: false,
      created_at: new Date().toISOString(),
    }, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider value={{
      user, login, logout, register,
      pickups, schedulePickup, updatePickupStatus, completePickup,
      collectorRequests, acceptPickup, rejectPickup,
      wallet, redeemReward, pointTransactions,
      notifications, unreadCount, markNotificationRead, markAllRead,
      showToast, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
