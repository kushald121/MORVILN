'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useTheme } from 'next-themes';

export default function AdminPanel() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
//   const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/subjective.login/admin.login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPFP');
    router.push('/subjective.login/admin.login');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Product Card */}
          <Link href="/subjective.login/admin.login/adminpanel/add-product">
            <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-border">
              <h2 className="text-xl font-semibold text-card-foreground mb-2">Add Product</h2>
              <p className="text-muted-foreground">Add new t-shirts to your store.</p>
            </div>
          </Link>

          {/* Update Product Card */}
          <Link href="/subjective.login/admin.login/adminpanel/update-product">
            <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-border">
              <h2 className="text-xl font-semibold text-card-foreground mb-2">Update Product</h2>
              <p className="text-muted-foreground">Update product details and pricing.</p>
            </div>
          </Link>

          {/* Delete Product Card */}
          <Link href="/subjective.login/admin.login/adminpanel/delete-product">
            <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-border">
              <h2 className="text-xl font-semibold text-card-foreground mb-2">Delete Product</h2>
              <p className="text-muted-foreground">Remove products from your catalog.</p>
            </div>
          </Link>

          {/* View Orders Card */}
          <Link href="/subjective.login/admin.login/adminpanel/view-orders">
            <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-border">
              <h2 className="text-xl font-semibold text-card-foreground mb-2">View Orders</h2>
              <p className="text-muted-foreground">See all received orders and status.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
