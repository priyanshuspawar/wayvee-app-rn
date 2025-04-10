import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string) {
  try {
    const result = await SecureStore.getItemAsync(key);
    return result;
  } catch (error) {
    alert('No values stored under that key.');
    return null;
  }
}
