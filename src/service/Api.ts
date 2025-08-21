// src/services/Api.ts

// Perbaikan: import tipe data yang diperlukan
import type { Events } from '../Types';

// Fixed API URL - removed duplicate /users
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userApi = {

  // ✅ Perbaikan: fetchUsers sudah benar mengambil data.data
  async fetchUsers(): Promise<Events[]> {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // ✅ Perbaikan: Pastikan getUserById mengembalikan `data.data`
  async getUserById(userId: number): Promise<Events> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Mengembalikan data di dalam objek respons JSON Laravel
      return data.data; 
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // ✅ Perbaikan: createUser sudah benar mengambil data.data
  async createUser(userData: Omit<Events, 'id'>): Promise<Events> {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // ✅ Perbaikan: Pastikan updateUser mengembalikan `data.data`
  async updateUser(userId: number, userData: Partial<Events>): Promise<Events> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Mengembalikan data di dalam objek respons JSON Laravel
      return data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // ✅ Perbaikan: deleteUser tidak perlu mengembalikan data, cukup memastikan respons sukses
  async deleteUser(userId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Melempar error dengan pesan dari API jika ada
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};