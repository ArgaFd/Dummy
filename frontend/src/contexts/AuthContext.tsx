import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, type AuthResponse } from '../services/api';

type User = {
  id: string;
  email: string;
  role: 'owner' | 'cashier';
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('restaurant_app_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      authAPI.getMe().then((response: any) => {
        if (response.data.success) {
          const userData = response.data.data;
          // Ensure user role matches expected type
          const typedUser: User = {
            ...userData,
            role: userData.role as 'owner' | 'cashier'
          };
          setUser(typedUser);
          localStorage.setItem('user', JSON.stringify(typedUser));
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('restaurant_app_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }).catch(() => {
        // Token invalid, clear storage
        localStorage.removeItem('restaurant_app_token');
        localStorage.removeItem('user');
        setUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const { token, user: userData }: AuthResponse = response.data.data;
        
        // Store token and user data
        localStorage.setItem('restaurant_app_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Ensure user role matches expected type
        const typedUser: User = {
          ...userData,
          role: userData.role as 'owner' | 'cashier'
        };
        setUser(typedUser);
        
        // Redirect based on role
        switch (userData.role) {
          case 'owner':
            navigate('/admin/dashboard');
            break;
          case 'cashier':
            navigate('/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant_app_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
