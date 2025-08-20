// src/services/Api.ts
export interface Events {
  id: number;
  title: string;
  description: string;
  date: string;
  created_at: Date;
  updated_at: Date;
}

// Fixed API URL - removed duplicate /users
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userApi = {
async fetchUsers(): Promise<Events[]> {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data)
    return data.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
},

async deleteUser(userId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
},

async getUserById(userId: number): Promise<Events> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
},

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
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
};