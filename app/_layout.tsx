import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "../components/ThemeContext";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [segments]);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Redirect to login if no token and not in auth group
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      // Redirect to chat if token exists and in auth group
      router.replace("/(tabs)/chat");
    }
  };
}

export default function Layout() {
  useProtectedRoute();

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
