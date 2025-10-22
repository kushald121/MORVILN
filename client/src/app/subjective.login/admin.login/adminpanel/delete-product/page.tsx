'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useTheme } from 'next-themes';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}

export default function DeleteProduct() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const router = useRouter();
//   const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/subjective.login/admin.login');
    }
    // Fetch products (mock data for now)
    setProducts([
      { id: 1, name: 'T-Shirt 1', price: 20, description: 'Comfortable cotton t-shirt', category: 'Clothing', stock: 10 },
      { id: 2, name: 'T-Shirt 2', price: 25, description: 'Premium quality t-shirt', category: 'Clothing', stock: 5 }
    ]);
  }, [router]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDelete = () => {
    if (selectedProduct) {
      // Delete product logic here
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      alert('Product deleted successfully!');
      setSelectedProduct(null);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Delete Product</h1>
          <Link href="/subjective.login/admin.login/adminpanel">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product List */}
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Select Product to Delete</h2>
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id ? 'border-destructive bg-destructive/10' : 'border-border hover:bg-accent'
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                  <p className="text-muted-foreground">${product.price}</p>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Confirmation */}
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Delete Confirmation</h2>
            {selectedProduct ? (
              <div className="space-y-4">
                <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <h3 className="font-semibold text-destructive">{selectedProduct.name}</h3>
                  <p className="text-muted-foreground">${selectedProduct.price}</p>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
                <p className="text-muted-foreground">Are you sure you want to delete this product? This action cannot be undone.</p>
                <button
                  onClick={handleDelete}
                  className="w-full bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a product to delete.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
