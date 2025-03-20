import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../components/ThemeContext";
import { useRouter } from "expo-router";
import instance, { removeAuthToken } from "../../utils/axios";
import { MaterialIcons } from "@expo/vector-icons";

interface UserProfile {
  username: string;
  email: string;
  gender: string;
}

export default function ProfileScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await instance.get("/auth/profile/");
      setProfile(response.data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await removeAuthToken();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <View className="p-6">
        <View className="items-center mb-8">
          <View
            className={`w-24 h-24 rounded-full mb-4 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } items-center justify-center`}
          >
            <MaterialIcons
              name="person"
              size={48}
              color={isDarkMode ? "#f3f4f6" : "#4b5563"}
            />
          </View>
          <Text
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {profile?.username || "Loading..."}
          </Text>
        </View>

        <View
          className={`rounded-xl p-4 mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <View className="flex-row items-center mb-4">
            <MaterialIcons
              name="email"
              size={24}
              color={isDarkMode ? "#f3f4f6" : "#4b5563"}
            />
            <Text
              className={`ml-3 text-lg ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {profile?.email || "Loading..."}
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons
              name="person"
              size={24}
              color={isDarkMode ? "#f3f4f6" : "#4b5563"}
            />
            <Text
              className={`ml-3 text-lg capitalize ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {profile?.gender || "Loading..."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-xl p-4 items-center"
        >
          <Text className="text-white text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
