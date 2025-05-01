import { jwtDecode } from 'jwt-decode';

export function useAuth() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const { exp } = decoded;
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('token');
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}