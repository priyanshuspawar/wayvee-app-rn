import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

import userStore from '~/store/user';
import { GetStayResponse, Stay } from '~/utils/responseTypes';

export async function getValueFromSecureStore(key: string) {
  return await SecureStore.getItemAsync(key);
}

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export const getAgent = async (agentId: string) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const user = await axios.get<{ data: User }>(
      `${BASE_URL}/user/${agentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return user.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async () => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const user = await axios.get<{ data: User }>(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(user.data, '@@');
    return { user: user.data.data, token };
  } catch (error) {
    throw error;
  }
};

export const initializeAuth = async (payload: { email: string }) => {
  try {
    await axios.post(`${BASE_URL}/auth`, payload);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.message);
    }
    throw error;
  }
};

export const govtVerification = async (formData: FormData) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const uploadres = await axios.post<{
      message: string;
      data: {
        govtIdUrl: string;
        key: string;
      };
    }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/upload/government_id`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/upload_id`,
      {
        id_key: uploadres.data.data.key,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const apply_for_agent = async (payload: {
  about: string;
  agencyName: string;
  servicesOffered: string[];
  locations: { longitude: number; latitude: number; label: string }[];
}) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.post<{ message: string }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/user/apply_for_agent`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.message;
  } catch (error) {
    throw error;
  }
};

export const craeteStay = async () => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.post<{ data: { id: string } }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/stays`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data.data);
    return res.data.data.id;
  } catch (error) {
    throw error;
  }
};

export const getStayById = async ({ stayId }: { stayId: string }) => {
  try {
    const res = await axios.post<GetStayResponse>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/stays/${stayId}`
    );
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const getStaysOfAgent = async () => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.get<{ data: Stay[] }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/agent/stays`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateStay = async ({
  updateStay,
}: {
  updateStay: Partial<Stay>;
}) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.patch<{ message: string }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/stays`,
      updateStay,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.message;
  } catch (error) {
    throw error;
  }
};

export const publishStay = async (stayId: string) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.patch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/stays/publish`,
      {
        id: stayId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getStays = async () => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.get<{ message: string; data: Stay[] }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/stays?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const addToWishlist = async ({
  stayId,
  userId,
}: {
  userId: string;
  stayId: string;
}) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/wishlist`,
      {
        userId,
        stayId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getWishlist = async () => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) {
      throw new Error('No token present failed');
    }
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/wishlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const createBooking = async ({
  stayId,
  userId,
  guests,
  totalPrice,
}: {
  stayId: string;
  userId: string;
  guests: number;
  totalPrice: number;
}) => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) throw new Error('No token present');
    const outDate = new Date();
    outDate.setDate(outDate.getDate() + 1);
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/bookings`,
      {
        stayId,
        userId,
        checkInDate: new Date().toISOString(), // Send as ISO string
        checkOutDate: outDate.toISOString(), // Send as ISO string
        guests,
        totalPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    throw error;
  }
};
