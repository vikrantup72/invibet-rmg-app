import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage() {
  async function setString(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (err: any) {
      return false;
    }
  }

  async function getString(key: string, defaultValue: string | null = null) {
    const value = await AsyncStorage.getItem(key);
    return value ?? defaultValue;
  }

  async function setObject(key: string, value: Record<string, any>) {
    try {
      const data = JSON.stringify(value);
      await AsyncStorage.setItem(key, data);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function getObject(key: string, defaultValue: any | null = null) {
    const value = await AsyncStorage.getItem(key);
    if (!value) return defaultValue;

    try {
      return JSON.parse(value);
    } catch (err) {
      return defaultValue;
    }
  }

  async function removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (err: any) {
      return false;
    }
  }

  async function clearEmpty() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (err: any) {
      return false;
    }
  }

  return {
    setString,
    getString,
    setObject,
    getObject,
    removeItem,
    clearEmpty,
  };
}
