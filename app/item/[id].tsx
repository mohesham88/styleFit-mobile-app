import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../components/ThemeContext";
import axios from "../../utils/axios";

interface ItemDetails {
  id: string;
  type: string;
  image: string;
  category: string;
  season: string;
  description: string;
}

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error);
      Alert.alert("Error", "Failed to load item details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Text
          className={`text-xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Item Details
        </Text>
      </View>

      <ScrollView className="flex-1">
        <Image
          source={{ uri: item.image }}
          className="w-full h-96"
          resizeMode="cover"
        />

        <View className="p-4">
          <Text
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {item.type}
          </Text>

          <View className="flex-row items-center mb-4">
            <MaterialIcons
              name="category"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <Text
              className={`ml-2 text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {item.category}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <MaterialIcons
              name="wb-sunny"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <Text
              className={`ml-2 text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {item.season}
            </Text>
          </View>

          <Text
            className={`text-base ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {item.description}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
