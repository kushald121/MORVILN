import { apiClient } from '@/lib/api';
import { getErrorMessage, logError, parseError, retryWithBackoff } from '@/lib/errorHandler';

export interface Address {
  id: string;
  user_id: string;
  label?: string; // 'Home', 'Work', 'Other'
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressData {
  label?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
}

class AddressService {
  // Get all addresses for user with retry on network error
  static async getAddresses(): Promise<Address[]> {
    try {
      const response = await retryWithBackoff(
        () => apiClient.get('/user/addresses'),
        { maxRetries: 2 }
      );
      return response.data.addresses || [];
    } catch (error: any) {
      logError(error, 'AddressService.getAddresses');
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  // Get single address by ID
  static async getAddress(id: string): Promise<Address> {
    try {
      const response = await apiClient.get(`/user/addresses/${id}`);
      return response.data.address;
    } catch (error: any) {
      logError(error, 'AddressService.getAddress');
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  // Create new address
  static async createAddress(data: CreateAddressData): Promise<Address> {
    try {
      // Validate required fields
      if (!data.full_name || !data.phone || !data.address_line_1 || !data.city || !data.state || !data.postal_code) {
        throw new Error('Please fill in all required fields');
      }

      // Validate phone
      if (!this.validatePhone(data.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate postal code
      if (!this.validatePostalCode(data.postal_code)) {
        throw new Error('Please enter a valid 6-digit postal code');
      }

      const response = await apiClient.post('/user/addresses', {
        ...data,
        country: data.country || 'India',
      });
      return response.data.address;
    } catch (error: any) {
      logError(error, 'AddressService.createAddress');
      
      // If it's our validation error, throw it as-is
      if (error instanceof Error && !error.message.includes('Network')) {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  // Update address
  static async updateAddress(id: string, data: Partial<CreateAddressData>): Promise<Address> {
    try {
      // Validate phone if provided
      if (data.phone && !this.validatePhone(data.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate postal code if provided
      if (data.postal_code && !this.validatePostalCode(data.postal_code)) {
        throw new Error('Please enter a valid 6-digit postal code');
      }

      const response = await apiClient.put(`/user/addresses/${id}`, data);
      return response.data.address;
    } catch (error: any) {
      logError(error, 'AddressService.updateAddress');
      
      // If it's our validation error, throw it as-is
      if (error instanceof Error && !error.message.includes('Network')) {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  // Delete address
  static async deleteAddress(id: string): Promise<void> {
    try {
      await apiClient.delete(`/user/addresses/${id}`);
    } catch (error: any) {
      logError(error, 'AddressService.deleteAddress');
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  // Set default address
  static async setDefaultAddress(id: string): Promise<Address> {
    try {
      const response = await apiClient.put(`/user/addresses/${id}/default`);
      return response.data.address;
    } catch (error: any) {
      logError(error, 'AddressService.setDefaultAddress');
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  // Format address for display
  static formatAddress(address: Address): string {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.landmark,
      address.city,
      address.state,
      address.postal_code,
    ].filter(Boolean);
    return parts.join(', ');
  }

  // Validate phone number
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  // Validate postal code (Indian PIN code)
  static validatePostalCode(postalCode: string): boolean {
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(postalCode.replace(/\s+/g, ''));
  }
}

export { AddressService };
