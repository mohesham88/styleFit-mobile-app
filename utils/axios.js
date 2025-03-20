import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: "http://192.168.1.14:8000",
});

// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token) => {
  await AsyncStorage.setItem("auth_token", token);
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem("auth_token");
};

export default instance;
