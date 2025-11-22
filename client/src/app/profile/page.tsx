"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiClient } from '@/lib/api';
import { AddressService, type Address } from '../services/address.service';
import { 
  User, Mail, Phone, MapPin, Settings, ShoppingBag, Heart, 
  Edit2, Save, X, LogOut, Package, Clock, Shield 
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider?: string;
  isVerified?: boolean;
  createdAt?: string;
}

interface UserStats {
  totalOrders: number;
  wishlistItems: number;
  pendingOrders: number;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuth();
  const toast = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    wishlistItems: 0,
    pendingOrders: 0
  });
  const [editedData, setEditedData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  useEffect(() => {
    loadUserData();
    loadUserStats();
    loadUserAddresses();
  }, [authUser, isAuthenticated]);

  const loadUserData = () => {
    try {
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('userToken');
      
      if (!hasToken && !isAuthenticated) {
        toast.warning('Please login to view your profile');
        router.push('/login');
        return;
      }

      const userData = authService.getCurrentUser();
      if (!userData) {
        router.push('/login');
        return;
      }
      setUser(userData);
      setEditedData({
        name: userData.name || '',
        phone: userData.phone || '',
        address: '',
        city: '',
        country: ''
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      // Fetch orders
      const ordersResponse = await apiClient.get('/api/orders');
      const orders = ordersResponse.data.orders || [];
      
      // Fetch favorites
      const favoritesResponse = await apiClient.get('/api/favorites');
      const favorites = favoritesResponse.data.favorites || [];
      
      setStats({
        totalOrders: orders.length,
        wishlistItems: favorites.length,
        pendingOrders: orders.filter((order: any) => 
          order.status === 'pending' || order.status === 'processing'
        ).length
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Keep default stats if error
    }
  };

  const loadUserAddresses = async () => {
    try {
      const fetchedAddresses = await AddressService.getAddresses();
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      // Keep empty addresses if error
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update user profile
      const response = await apiClient.put('/api/auth/profile', {
        name: editedData.name,
        phone: editedData.phone
      });
      
      if (response.data.success) {
        if (user) {
          const updatedUser = {
            ...user,
            name: editedData.name,
            phone: editedData.phone
          };
          setUser(updatedUser);
          
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedData({
        name: user.name || '',
        phone: user.phone || '',
        address: '',
        city: '',
        country: ''
      });
    }
    setIsEditing(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Profile</span>
            </h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </motion.div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  {user.provider && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                      {user.provider === 'google' && <FcGoogle className="w-5 h-5" />}
                      {user.provider === 'facebook' && <FaFacebook className="w-5 h-5 text-blue-600" />}
                      {user.provider === 'email' && <Mail className="w-5 h-5 text-gray-600" />}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4 mb-1">{user.name}</h2>
                <p className="text-sm text-gray-500">Member since {memberSince}</p>
                {user.isVerified && (
                  <div className="mt-2 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Total Orders</span>
                  </div>
                  <span className="font-bold text-orange-600 text-lg">{stats.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Heart className="w-5 h-5 text-rose-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Wishlist Items</span>
                  </div>
                  <span className="font-bold text-rose-600 text-lg">{stats.wishlistItems}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                  </div>
                  <span className="font-bold text-amber-600 text-lg">{stats.pendingOrders}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span className="text-sm font-medium">{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-orange-500" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-gray-100">
                      <p className="text-gray-900 font-medium">{user.name}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    Email Address
                  </label>
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-gray-100">
                    <p className="text-gray-900 font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-gray-100">
                      <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Saved Addresses
                  </label>
                  <div className="space-y-3">
                    {addresses.length > 0 ? (
                      addresses.slice(0, 2).map((address) => (
                        <div 
                          key={address.id}
                          className="p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-900 font-medium">{address.full_name}</p>
                            {address.label && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {address.label}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">
                            {address.address_line_1}
                            {address.address_line_2 && `, ${address.address_line_2}`}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {address.city}, {address.state} - {address.postal_code}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">{address.phone}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-sm">No saved addresses</p>
                        <button
                          onClick={() => router.push('/profile/addresses')}
                          className="text-orange-600 text-sm font-medium mt-2 hover:underline"
                        >
                          Add your first address →
                        </button>
                      </div>
                    )}
                    {addresses.length > 2 && (
                      <button
                        onClick={() => router.push('/profile/addresses')}
                        className="text-orange-600 text-sm font-medium hover:underline"
                      >
                        View all {addresses.length} addresses →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Provider Info */}
              {user.provider && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>Account Type:</strong> Signed in with {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FcGoogle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const FaFacebook = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default ProfilePage;
