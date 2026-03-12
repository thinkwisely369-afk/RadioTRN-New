const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BASE_URL = API_URL.replace('/api', '');

export { API_URL, BASE_URL };

// Types
export interface Station {
  id: number;
  name: string;
  slug?: string;
  tagline: string;
  genre: string;
  streamUrl: string;
  color: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Auth API
export const authAPI = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async register(username: string, email: string, password: string, role: string = 'user') {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }
};

// Stations API
export const stationsAPI = {
  async getAll(): Promise<Station[]> {
    const response = await fetch(`${API_URL}/stations`);
    if (!response.ok) throw new Error('Failed to fetch stations');
    return response.json();
  },

  async getAllAdmin(token: string): Promise<Station[]> {
    const response = await fetch(`${API_URL}/stations/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stations');
    return response.json();
  },

  async getById(id: number): Promise<Station> {
    const response = await fetch(`${API_URL}/stations/${id}`);
    if (!response.ok) throw new Error('Station not found');
    return response.json();
  },

  async getBySlug(slug: string): Promise<Station> {
    const response = await fetch(`${API_URL}/stations/slug/${slug}`);
    if (!response.ok) throw new Error('Station not found');
    return response.json();
  },

  async create(token: string, station: Omit<Station, 'id' | 'isActive'>) {
    const response = await fetch(`${API_URL}/stations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(station)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create station');
    }

    return response.json();
  },

  async update(token: string, id: number, station: Partial<Station>) {
    const response = await fetch(`${API_URL}/stations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(station)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update station');
    }

    return response.json();
  },

  async delete(token: string, id: number) {
    const response = await fetch(`${API_URL}/stations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete station');
    }

    return response.json();
  }
};

// Auth helpers
export const auth = {
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
};
