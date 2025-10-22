"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
class ProductService {
    static getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }
    // Create new product
    static async createProduct(productData) {
        const response = await fetch(`${API_BASE_URL}/admin/products`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error(`Failed to create product: ${response.statusText}`);
        }
        return response.json();
    }
    // Update product
    static async updateProduct(productId, productData) {
        const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        if (!response.ok) {
            throw new Error(`Failed to update product: ${response.statusText}`);
        }
        return response.json();
    }
    // Get categories
    static async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data.data || [];
    }
    // Upload images
    static async uploadImages(files) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/upload/images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to upload images');
        }
        const data = await response.json();
        return data.data || [];
    }
    // Delete image from Cloudinary
    static async deleteImage(publicId) {
        const response = await fetch(`${API_BASE_URL}/upload/${publicId}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        return response.json();
    }
    // Generate slug from product name
    static generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}
exports.ProductService = ProductService;
