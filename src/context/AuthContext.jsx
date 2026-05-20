import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi } from '../api/services';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'admin@system.com': {
    password: 'admin123',
    user: { id: 1, name: 'Admin User', email: 'admin@system.com', role: 'ADMIN', department: 'ECE', batch: '2018' },
  },
  'arif@ku.ac.bd': {
    password: 'member123',
    user: { id: 2, name: 'Arif Hossain', email: 'arif@ku.ac.bd', role: 'MEMBER', department: 'ECE', batch: '2020' },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('router_access_token');
    if (token) {
      if (token.startsWith('mock_token_')) {
        const mockUser = JSON.parse(localStorage.getItem('router_mock_user') || 'null');
        setUser(mockUser);
        setLoading(false);
      } else {
        userApi.getMe()
          .then(res => setUser(res.data.data || res.data))
          .catch(() => {
            localStorage.removeItem('router_access_token');
            localStorage.removeItem('router_refresh_token');
          })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const responseData = res.data.data || res.data;
      const accessToken = responseData.accessToken || responseData.token || responseData.jwt || (typeof responseData === 'string' ? responseData : null);
      const refreshToken = responseData.refreshToken;

      const extractRole = (obj) => {
        if (!obj) return 'MEMBER';
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) return extractRole(obj[0]);
        if (obj.authority) return obj.authority;
        if (obj.role) return obj.role;
        return 'MEMBER';
      };

      let rawRole = responseData.role || responseData.roles || responseData.authorities;

      let userData = responseData.user || (responseData.name ? {
        id: responseData.id || responseData.userId || 1,
        name: responseData.name,
        email: responseData.email || email,
        role: extractRole(rawRole),
      } : null);

      if (!accessToken) {
        return { success: false, error: 'Malformed response. Payload: ' + JSON.stringify(responseData) };
      }

      localStorage.setItem('router_access_token', accessToken);
      if (refreshToken) localStorage.setItem('router_refresh_token', refreshToken);

      if (!userData) {
        try {
          const meRes = await userApi.getMe();
          userData = meRes.data.data || meRes.data;
        } catch (err) {
          try {
            // Decode JWT to extract claims safely
            const base64Url = accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);

            rawRole = payload.role || payload.roles || payload.authorities || payload.scopes;

            userData = {
              id: payload.userId || payload.id || 1,
              email: payload.sub || payload.email || email,
              role: extractRole(rawRole),
              name: payload.name || payload.username || payload.fullName || 'Member',
            };
          } catch (decErr) {
            userData = { email, role: 'MEMBER', name: 'Member' };
          }
        }
      }

      // Enrich user with full profile data (phone, bio, etc.) if not already complete
      if (userData && !userData.phone) {
        try {
          const meRes = await userApi.getMe();
          const fullProfile = meRes.data.data || meRes.data;
          userData = { ...userData, ...fullProfile };
        } catch {
          // Not critical — continue with what we have
        }
      }

      setUser(userData);

      return { success: true, role: userData?.role || 'MEMBER' };
    } catch (err) {
      // No response = backend unreachable → try mock credentials
      if (!err.response) {
        const mock = MOCK_USERS[email];
        if (mock && mock.password === password) {
          const mockToken = 'mock_token_' + Date.now();
          localStorage.setItem('router_access_token', mockToken);
          localStorage.setItem('router_refresh_token', mockToken);
          localStorage.setItem('router_mock_user', JSON.stringify(mock.user));
          setUser(mock.user);
          return { success: true, role: mock.user.role };
        }
        return { success: false, error: 'Cannot connect to server. Use demo credentials or verify the backend is running.' };
      }
      const msg = err.response?.data?.message || 'Login failed. Check credentials.';
      return { success: false, error: msg };
    }
  };

  const initiateRegistration = async (data) => {
    try {
      const res = await authApi.registerInitiate({ name: data.name, email: data.email });
      return { success: true, message: res.data.message || 'OTP sent to your email' };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to send OTP'
      };
    }
  };

  const verifyOtp = async (email, otp, password) => {
    try {
      const res = await authApi.verifyOtp({ email, otp, password });
      const { accessToken, refreshToken, user: userData } = res.data.data || res.data;

      localStorage.setItem('router_access_token', accessToken);
      localStorage.setItem('router_refresh_token', refreshToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Invalid OTP or registration failed'
      };
    }
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { }
    localStorage.removeItem('router_access_token');
    localStorage.removeItem('router_refresh_token');
    localStorage.removeItem('router_mock_user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const res = await userApi.updateMe(user.id, updates);
    const responseData = res.data.data || res.data;
    // Merge: keep existing fields, apply submitted updates, then overlay backend response
    const updatedUser = { ...user, ...updates, ...responseData };
    setUser(updatedUser);
    return updatedUser;
  };

  const refreshUser = async () => {
    try {
      const res = await userApi.getMe();
      setUser(res.data.data || res.data);
    } catch { }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      initiateRegistration,
      verifyOtp,
      updateProfile,
      refreshUser,
      isAdmin: user?.role?.toUpperCase()?.includes('ADMIN') || false,
      isAuthenticated: !!user,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};