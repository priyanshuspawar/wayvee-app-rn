import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function save(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFromSecureStore(key: string) {
  return await SecureStore.getItemAsync(key);
}

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export const getUser = async () => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const user = await axios.get(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const initializeAuth = async (payload: { email: string }) => {
  try {
    await axios.post(`${BASE_URL}/auth`, payload);
  } catch (error) {
    throw error;
  }
};
