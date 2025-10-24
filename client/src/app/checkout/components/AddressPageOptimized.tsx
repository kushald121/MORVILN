'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, MapPin, Home, Briefcase, Plus, X, Check, LocateFixed } from 'lucide-react';
import { AddressService, type Address, type CreateAddressData } from '../../services/address.service';

const AddressPageOptimized = () => {
  const { user, isAuthenticated, token } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState<CreateAddressData>({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    landmark: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    label: 'Home',
    is_default: false,
  });

  useEffect(() => {
    // Check authentication - use token instead of user object
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('userToken');
    
    if (!hasToken && !isAuthenticated) {
      toast.warning('Please login to continue with checkout');
      router.push('/login');
      return;
    }

    // Load user data into form if available
    if (user) {
      setNewAddress(prev => ({
        ...prev,
        full_name: user.name || '',
        phone: user.phone || '',
      }));
    }

    // Check for previously selected address
    const storedAddress = localStorage.getItem('selectedAddress');
    if (storedAddress) {
      try {
        setSelectedAddress(JSON.parse(storedAddress));
      } catch (e) {
        console.error('Failed to parse stored address');
      }
    }

    fetchAddresses();
  }, [isAuthenticated, router, user, toast]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const fetchedAddresses = await AddressService.getAddresses();
      setAddresses(fetchedAddresses);

      // Auto-select default address if none is selected
      if (!selectedAddress && fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find((addr) => addr.is_default) || fetchedAddresses[0];
        setSelectedAddress(defaultAddr);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load addresses';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const createdAddress = await AddressService.createAddress(newAddress);
      
      setAddresses([...addresses, createdAddress]);
      toast.success('Address added successfully!');
      setShowNewAddress(false);
      
      // Reset form
      setNewAddress({
        full_name: user?.name || '',
        phone: user?.phone || '',
        address_line_1: '',
        address_line_2: '',
        landmark: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        label: 'Home',
        is_default: false,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setLoading(true);
      
      await AddressService.deleteAddress(addressId);
      
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
      }
      
      toast.success('Address deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    localStorage.setItem('selectedAddress', JSON.stringify(address));
  };

  const handleContinueToOrderSummary = () => {
    if (!selectedAddress) {
      toast.warning('Please select a delivery address');
      return;
    }

    // Save selected address to localStorage
    localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    
    // Navigate to order summary
    router.push('/checkout/order-summary');
  };

  const getLocationFromBrowser = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding API (you can use Google Maps API, OpenCage, etc.)
          // For now, just showing how to get coordinates
          console.log('Coordinates:', latitude, longitude);
          
          toast.info('Location detected! Please fill in address details.');
          setLoading(false);
          
        } catch (err) {
          console.error('Error getting location details:', err);
          toast.error('Could not fetch address from location');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.warning('Could not get your location. Please enter address manually.');
        setLoading(false);
      }
    );
  };

  const getAddressIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'work':
      case 'office':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  // Show loading state while checking authentication
  if (loading && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-wide">
            Select Delivery Address
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-blue-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-600 text-lg font-light">
            Choose where you want your order delivered
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Addresses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-slate-800">Saved Addresses</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewAddress(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </motion.button>
            </div>

            {/* Address List */}
            <AnimatePresence>
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => handleSelectAddress(address)}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                    selectedAddress?.id === address.id
                      ? 'border-slate-700 shadow-xl'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedAddress?.id === address.id
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {getAddressIcon(address.label)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-slate-800 text-lg">
                            {address.full_name}
                          </span>
                          {address.label && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                              {address.label}
                            </span>
                          )}
                          {address.is_default && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mb-1">{address.phone}</p>
                        <p className="text-slate-700 leading-relaxed">
                          {address.address_line_1}
                          {address.address_line_2 && `, ${address.address_line_2}`}
                          {address.landmark && `, ${address.landmark}`}
                          <br />
                          {address.city}, {address.state} - {address.postal_code}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {selectedAddress?.id === address.id && (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {addresses.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg font-light mb-4">No saved addresses</p>
                <p className="text-slate-400 mb-6">Add a new address to continue</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewAddress(true)}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300"
                >
                  Add Your First Address
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Continue Button */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 sticky top-24"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-medium text-slate-800 text-lg mb-4">Selected Address</h3>
              {selectedAddress ? (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                  <p className="font-medium text-slate-800 mb-2">{selectedAddress.full_name}</p>
                  <p className="text-sm text-slate-600 mb-1">{selectedAddress.phone}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedAddress.address_line_1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500 mb-6 text-sm">
                  Please select a delivery address to continue
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueToOrderSummary}
                disabled={!selectedAddress || loading}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                Continue to Order Summary
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* New Address Modal */}
        <AnimatePresence>
          {showNewAddress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewAddress(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
                  <h3 className="text-2xl font-light text-slate-800">Add New Address</h3>
                  <button
                    onClick={() => setShowNewAddress(false)}
                    className="text-slate-400 hover:text-slate-600 p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="p-8 space-y-6">
                  {/* Location Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getLocationFromBrowser}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-100 transition-all duration-300 border border-blue-200"
                  >
                    <LocateFixed className="w-5 h-5" />
                    <span>Use My Current Location</span>
                  </motion.button>

                  {/* Address Type */}
                  <div>
                    <label className="block text-slate-700 mb-3 font-medium">Address Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewAddress({ ...newAddress, label: type })}
                          className={`py-3 rounded-xl font-medium transition-all duration-200 ${
                            newAddress.label === type
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 mb-2 font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-2 font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAddress.address_line_1}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="House no., Building name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAddress.address_line_2}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Road name, Area, Colony"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 mb-2 font-medium">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-2 font-medium">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-2 font-medium">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="6-digit PIN"
                        required
                      />
                    </div>
                  </div>

                  {/* Make Default Checkbox */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="make-default"
                      checked={newAddress.is_default || false}
                      onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                      className="w-5 h-5 text-slate-700 border-slate-300 rounded focus:ring-slate-500"
                    />
                    <label htmlFor="make-default" className="text-slate-700 font-medium cursor-pointer">
                      Make this my default address
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowNewAddress(false)}
                      className="flex-1 border-2 border-slate-300 text-slate-700 py-4 rounded-xl font-medium hover:bg-slate-50 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full mx-auto"></div>
              <p className="mt-4 text-slate-700 font-medium">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AddressPageOptimized;
