import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiRefreshToken } from '~/api/services/serviceAuths';
import config from '~/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentToken, setCurrentToken] = useState(() => localStorage.getItem('token') || '');
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // Lưu refreshToken vào máy
      localStorage.setItem('refreshToken', refreshToken);
      // Cập nhật token để kích hoạt useEffect giải mã roles bên dưới
      setCurrentToken(accessToken);

      // Làm sạch URL (xóa các tham số token trên thanh địa chỉ)
      window.history.replaceState({}, document.title, window.location.pathname);

      // Điều hướng về Home
      navigate(config.routes.home, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentToken) {
      localStorage.removeItem('token');
      setRoles([]);
      return;
    }

    localStorage.setItem('token', currentToken);

    try {
      const decoded = jwtDecode(currentToken);
      let userRoles = decoded.roles || [];

      if (typeof userRoles === 'string') {
        userRoles = userRoles.split(',').map(r => r.trim().toUpperCase());
      }

      setRoles(userRoles);
    } catch (error) {
      console.error('Invalid token', error);
      setRoles([]);
    }
  }, [currentToken]);

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!currentToken && refreshToken) {
        await handleRefresh();
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!currentToken) return;

    let timer;

    try {
      const decoded = jwtDecode(currentToken);
      const exp = decoded.exp * 1000;
      const now = Date.now();

      const refreshTime = exp - now - 5 * 60 * 1000;

      if (refreshTime <= 0) {
        handleRefresh();
        return;
      }

      timer = setTimeout(() => {
        handleRefresh();
      }, refreshTime);
    } catch (err) {
      logout();
    }

    return () => clearTimeout(timer);
  }, [currentToken]);

  const handleRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return logout();

      const data = await apiRefreshToken(refreshToken);
      setCurrentToken(data.accessToken);
    } catch (error) {
      console.error('Refresh failed', error);
      logout();
    }
  };

  const logout = () => {
    setCurrentToken('');
    setRoles([]);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ currentToken, setCurrentToken, roles, logout }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
