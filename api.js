import axios from 'axios';
import { API_BASE_URL } from './config';

export const signUp = (data) => {
  return axios.post(`${API_BASE_URL}/api/auth/register`, data); 
};

