import { jwtDecode } from 'jwt-decode'
import axios from './axios';
import { LoginCredentials, User } from '@/types/auth';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await axios.post('/auth/login', credentials);
    const { token,accessToken, ...user } = response.data;

    
    // Store token in localStorage
    localStorage.setItem('token', accessToken);
    sessionStorage.setItem('token', accessToken);
    document.cookie = `token=${accessToken}; Path=/; SameSite=Strict; Max-Age=2592000;`;

    

    
    return { ...user, token };
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.exp);

    const currentTime = Date.now() / 1000;
    console.log(currentTime);
    return (decodedToken.exp ?? 0) > currentTime;
  } catch {
    return false;
  }
};