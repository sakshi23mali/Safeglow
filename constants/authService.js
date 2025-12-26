import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./api";

const TOKEN_KEY = "safeglow_token";
const USER_KEY = "safeglow_user";

// ----- storage helpers -----
export async function saveAuth(token, user) {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
  } catch (err) {
    console.log("Error saving auth:", err.message);
  }
}

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (err) {
    console.log("Error reading token:", err.message);
    return null;
  }
}

export async function getUser() {
  try {
    const value = await AsyncStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.log("Error reading user:", err.message);
    return null;
  }
}

export async function clearAuth() {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (err) {
    console.log("Error clearing auth:", err.message);
  }
}

// ----- wrappers that talk to backend & store token -----
export async function registerUser(payload) {
  const data = await authApi.register(payload);
  if (data?.token && data?.user) {
    await saveAuth(data.token, data.user);
  }
  return data;
}

export async function loginUser(payload) {
  const data = await authApi.login(payload);
  if (data?.token && data?.user) {
    await saveAuth(data.token, data.user);
  }
  return data;
}