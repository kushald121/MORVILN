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

export default function UpdateProduct() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: ''
  });
  const router = useRouter();
  // const { theme } = useTheme();

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
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update product logic here
    alert('Product updated successfully!');
    setSelectedProduct(null);
    setFormData({ name: '', price: '', description: '', category: '', stock: '' });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Update Product</h1>
          <Link href="/subjective.login/admin.login/adminpanel">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product List */}
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Select Product to Update</h2>
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent'
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <h3 className="font-semibold text-card-foreground">{product.name}</h3>
                  <p className="text-muted-foreground">${product.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Update Product Details</h2>
            {selectedProduct ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Update Product
                </button>
              </form>
            ) : (
              <p className="text-muted-foreground">Select a product to update.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
