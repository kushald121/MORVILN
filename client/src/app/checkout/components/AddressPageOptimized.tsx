'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Trash2, MapPin, Home, Briefcase, Plus, X, Check, LocateFixed, ArrowLeft } from 'lucide-react';
import { AddressService, type Address, type CreateAddressData } from '../../services/address.service';

const AddressPageOptimized = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

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
    const checkAuth = () => {
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('userToken');
      
      if (!hasToken) {
        toast.warning('Please login to continue with checkout');
        router.push('/login');
        return false;
      }
      return true;
    };

    const timer = setTimeout(() => {
      if (checkAuth()) {
        setIsAuthChecked(true);
        
        if (user) {
          setNewAddress(prev => ({
            ...prev,
            full_name: user.name || '',
            phone: user.phone || '',
          }));
        }

        const storedAddress = localStorage.getItem('selectedAddress');
        if (storedAddress) {
          try {
            setSelectedAddress(JSON.parse(storedAddress));
          } catch (e) {
            console.error('Failed to parse stored address');
          }
        }

        fetchAddresses();
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const fetchedAddresses = await AddressService.getAddresses();
      setAddresses(fetchedAddresses);

      if (!selectedAddress && fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find((addr) => addr.is_default) || fetchedAddresses[0];
        setSelectedAddress(defaultAddr);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load addresses';
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        router.push('/login');
        return;
      }
      
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

    localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    router.push('/checkout/order-summary');
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

  if (!isAuthChecked || (loading && addresses.length === 0)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-gray-700 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black text-white py-8 pt-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
            Select Delivery Address
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            Choose where you want your order delivered
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Addresses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Saved Addresses</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewAddress(true)}
                className="flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
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
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectAddress(address)}
                  className={`bg-gray-900 rounded-xl p-5 border-2 cursor-pointer transition-all duration-300 ${
                    selectedAddress?.id === address.id
                      ? 'border-white'
                      : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedAddress?.id === address.id
                            ? 'bg-white text-black'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {getAddressIcon(address.label)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white text-lg">
                            {address.full_name}
                          </span>
                          {address.label && (
                            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                              {address.label}
                            </span>
                          )}
                          {address.is_default && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 mb-1">{address.phone}</p>
                        <p className="text-gray-500 leading-relaxed text-sm">
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
                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
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
                className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg mb-4">No saved addresses</p>
                <p className="text-gray-600 mb-6">Add a new address to continue</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewAddress(true)}
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  Add Your First Address
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Continue Button */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-900 rounded-xl p-5 border border-gray-800 sticky top-24"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-white text-lg mb-4">Selected Address</h3>
              {selectedAddress ? (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                  <p className="font-medium text-white mb-2">{selectedAddress.full_name}</p>
                  <p className="text-sm text-gray-400 mb-1">{selectedAddress.phone}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {selectedAddress.address_line_1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mb-6 text-sm">
                  Please select a delivery address to continue
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueToOrderSummary}
                disabled={!selectedAddress || loading}
                className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewAddress(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              >
                <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Add New Address</h3>
                  <button
                    onClick={() => setShowNewAddress(false)}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="p-6 space-y-5">
                  {/* Address Type */}
                  <div>
                    <label className="block text-gray-300 mb-3 font-medium text-sm">Address Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewAddress({ ...newAddress, label: type })}
                          className={`py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                            newAddress.label === type
                              ? 'bg-white text-black'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
                      <label className="block text-gray-300 mb-2 font-medium text-sm">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium text-sm">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAddress.address_line_1}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                      placeholder="House no., Building name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAddress.address_line_2}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                      placeholder="Road name, Area, Colony"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium text-sm">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium text-sm">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium text-sm">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium text-sm">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
                        placeholder="6-digit PIN"
                        required
                      />
                    </div>
                  </div>

                  {/* Make Default Checkbox */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="make-default"
                      checked={newAddress.is_default || false}
                      onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                      className="w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-white text-white"
                    />
                    <label htmlFor="make-default" className="text-gray-300 font-medium cursor-pointer text-sm">
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
                      className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="flex-1 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AddressPageOptimized;
