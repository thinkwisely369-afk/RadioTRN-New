const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
const BASE_URL = API_URL.replace('/api', '');

// Default fetch options for better compatibility
const fetchOptions = {
  headers: {
    'Accept': 'application/json, text/html',
    'X-Requested-With': 'XMLHttpRequest' // Helps bypass some CSRF/WAF filters
  }
};

/**
 * Custom fetch wrapper to detect WAF/Cloudflare managed challenges
 */
async function validatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...fetchOptions.headers,
      ...options.headers,
    }
  });

  const contentType = response.headers.get('content-type');

  // If we expect JSON but get HTML, it's likely a WAF challenge or a redirect to login
  if (contentType && contentType.includes('text/html')) {
    const text = await response.clone().text();

    // Check for common WAF challenge signatures
    const isChallenge =
      text.includes('cf-challenge') ||
      text.includes('cloudflare') ||
      text.includes('managed challenge') ||
      text.includes('captcha') ||
      text.includes('challenge-platform');

    if (isChallenge) {
      console.error('WAF Challenge detected at:', url);
      // We can't easily "solve" it programmatically, but we can notify the app
      throw new Error('WAF_CHALLENGE_DETECTED');
    }
  }

  return response;
}

export { API_URL, BASE_URL, validatedFetch };

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
    const response = await validatedFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        ...fetchOptions.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async register(username: string, email: string, password: string, role: string = 'user') {
    const response = await validatedFetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        ...fetchOptions.headers,
        'Content-Type': 'application/json'
      },
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
    const response = await validatedFetch(`${API_URL}/stations`, {
      ...fetchOptions
    });
    if (!response.ok) throw new Error('Failed to fetch stations');
    return response.json();
  },

  async getAllAdmin(token: string): Promise<Station[]> {
    const response = await validatedFetch(`${API_URL}/stations/all`, {
      headers: {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch stations');
    return response.json();
  },

  async getById(id: number): Promise<Station> {
    const response = await validatedFetch(`${API_URL}/stations/${id}`, {
      ...fetchOptions
    });
    if (!response.ok) throw new Error('Station not found');
    return response.json();
  },

  async getBySlug(slug: string): Promise<Station> {
    const response = await validatedFetch(`${API_URL}/stations/slug/${slug}`, {
      ...fetchOptions
    });
    if (!response.ok) throw new Error('Station not found');
    return response.json();
  },

  async create(token: string, station: Omit<Station, 'id' | 'isActive'>) {
    const response = await validatedFetch(`${API_URL}/stations`, {
      method: 'POST',
      headers: {
        ...fetchOptions.headers,
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
    const response = await validatedFetch(`${API_URL}/stations/${id}`, {
      method: 'PUT',
      headers: {
        ...fetchOptions.headers,
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
    const response = await validatedFetch(`${API_URL}/stations/${id}`, {
      method: 'DELETE',
      headers: {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`
      }
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
