'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useTheme } from 'next-themes';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  products: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  date: string;
}

export default function ViewOrders() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
//   const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/subjective.login/admin.login');
    }
    // Fetch orders (mock data for now)
    setOrders([
      {
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        products: [{ name: 'T-Shirt 1', quantity: 2, price: 20 }],
        total: 40,
        status: 'Pending',
        date: '2023-10-01'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        products: [{ name: 'T-Shirt 2', quantity: 1, price: 25 }],
        total: 25,
        status: 'Shipped',
        date: '2023-10-02'
      }
    ]);
  }, [router]);

  const updateStatus = (id: number, newStatus: string) => {
    setOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
    alert('Order status updated!');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">View Orders</h1>
          <Link href="/subjective.login/admin.login/adminpanel">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">Order #{order.id}</h2>
                  <p className="text-muted-foreground">{order.customerName} - {order.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-card-foreground">Total: ${order.total}</p>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="mt-2 px-3 py-1 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-card-foreground mb-2">Products:</h3>
                <div className="space-y-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-card-foreground">{product.name} x {product.quantity}</span>
                      <span className="text-muted-foreground">${product.price * product.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
