import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Register
export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

// Login
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  const { token } = response.data;

  // Save token to local storage (or secure storage)
  await AsyncStorage.setItem('token', token);

  return token;
};
