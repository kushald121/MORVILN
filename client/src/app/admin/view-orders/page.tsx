'use client';

import React, { useState, useEffect } from 'react';
import { AdminProtectedRoute } from '../components/AdminProtectedRoute';
import axios from 'axios';
import Link from 'next/link';

interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  shipping_address: any;
  products: any; // JSONB field with products array
  subtotal_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: string;
  fulfillment_status: string;
  payment_method?: string;
  payment_gateway?: string;
  payment_gateway_id?: string;
  ordered_at: string;
  paid_at?: string;
  fulfilled_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  // For backward compatibility with status
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  cancelled: number;
}

const ViewOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      // Handle different response structures
      let ordersData = response.data.data?.orders || response.data.data || response.data.orders || response.data;
      
      // Ensure ordersData is always an array
      if (!Array.isArray(ordersData)) {
        console.warn('Orders data is not an array:', ordersData);
        ordersData = [];
      }
      
      // Map fulfillment_status to status for compatibility
      ordersData = ordersData.map((order: any) => ({
        ...order,
        status: order.fulfillment_status || order.status || 'pending'
      }));
      
      setOrders(ordersData);
      calculateStats(ordersData);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setUpdateMessage({ type: 'error', text: 'Failed to fetch orders' });
      setOrders([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (ordersData: Order[] | any) => {
    // Ensure ordersData is an array
    const ordersArray = Array.isArray(ordersData) ? ordersData : [];
    
    const stats = {
      total: ordersArray.length,
      pending: ordersArray.filter(o => (o.status || o.fulfillment_status) === 'pending' || (o.status || o.fulfillment_status) === 'unfulfilled').length,
      confirmed: ordersArray.filter(o => (o.status || o.fulfillment_status) === 'confirmed').length,
      delivered: ordersArray.filter(o => (o.status || o.fulfillment_status) === 'delivered' || (o.status || o.fulfillment_status) === 'fulfilled').length,
      cancelled: ordersArray.filter(o => (o.status || o.fulfillment_status) === 'cancelled').length
    };
    setStats(stats);
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user_id && order.user_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${adminToken}` } }
      );

      setUpdateMessage({ type: 'success', text: 'Order status updated successfully!' });
      fetchOrders();
    } catch (error: any) {
      setUpdateMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update order status' });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
      case 'unfulfilled':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
      case 'fulfilled':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800">
                ← Back to Dashboard
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Store
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 max-w-7xl my-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">Confirmed</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">Delivered</h3>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">Cancelled</h3>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">View Orders</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by order number or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Order #</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">User ID</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{order.order_number || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {order.user_id ? `${order.user_id.substring(0, 8)}...` : 'Guest'}
                        </td>
                        <td className="px-4 py-3">₹{order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {updateMessage.text && (
              <div className={`mt-4 p-3 rounded-lg ${
                updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {updateMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{new Date(selectedOrder.created_at || selectedOrder.ordered_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium">{selectedOrder.payment_status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium">₹{selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>

                {selectedOrder.shipping_address && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(selectedOrder.shipping_address, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedOrder.products && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Products</p>
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(selectedOrder.products, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
};

export default ViewOrders;
