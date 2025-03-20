import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../components/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import axios from "../../utils/axios";
import { useRouter } from "expo-router";

interface Item {
  id: string;
  type: string;
  image: string;
  category: string;
}

const CATEGORIES: Record<string, string> = {
  ALL: "other",
  ACCESSORY: "accessories",
  TOP: "top",
  BOTTOM: "bottom",
  DRESS: "dress",
  FOOTWEAR: "footwear",
  OUTERWEAR: "outerwear",
  SHOES: "shoes",
  ACCESSORIES: "accessories",
  BAGS: "bags",
  JEWELRY: "jewelry",
  HATS: "hats",
  SCARVES: "scarves",
  BELTS: "belts",
  SOCKS: "socks",
  UNDERWEAR: "underwear",
  SWIMWEAR: "swimwear",
  ACTIVEWEAR: "activewear",
  SLEEPWEAR: "sleepwear",
};

export default function ClosetScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async (category: string) => {
    try {
      setLoading(true);
      let response;
      if (category === "ALL") {
        response = await axios.get("/items/");
      } else {
        response = await axios.get(`/items?category=${CATEGORIES[category]}`);
      }
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to add photos."
      );
      return false;
    }
    return true;
  };

  const handleItemPress = (itemId: string) => {
    router.push(`/item/${itemId}`);
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      formData.append("category", CATEGORIES[selectedCategory]);

      const response = await axios.post("/items/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Image uploaded successfully");
      router.push(`/item/${response.data.id}`);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    } finally {
      setIsModalVisible(false);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera permissions to take photos."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    }
  };

  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,

        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        await handleImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <View className="px-4 py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {Object.keys(CATEGORIES).map((category: string) => (
            <TouchableOpacity
              key={category}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-indigo-500"
                  : isDarkMode
                  ? "bg-gray-800"
                  : "bg-gray-100"
              }`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                className={
                  selectedCategory === category
                    ? "text-white"
                    : isDarkMode
                    ? "text-gray-100"
                    : "text-gray-800"
                }
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {loading ? (
          <View className="flex-1 justify-center items-center py-8">
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : items.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text
              className={`text-lg text-center ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              You don't have any items for this category
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                className={`w-[48%] rounded-lg mb-4 overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
                onPress={() => handleItemPress(item.id)}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text
                    className={isDarkMode ? "text-gray-100" : "text-gray-800"}
                  >
                    {item.type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-4 left-0 right-0 items-center">
        <TouchableOpacity
          className="bg-indigo-500 rounded-full p-4 shadow-lg"
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialIcons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Image Source Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          onPress={() => setIsModalVisible(false)}
        >
          <View
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-t-3xl p-4`}
          >
            <View className="items-center mb-6">
              <View className="w-16 h-1 bg-gray-300 rounded-full mb-4" />
              <Text
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Add Photo
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center p-4 mb-2"
              onPress={takePicture}
            >
              <MaterialIcons
                name="camera-alt"
                size={24}
                color={isDarkMode ? "#fff" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg ${
                  isDarkMode ? "text-white" : "text-gray-600"
                }`}
              >
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 mb-4"
              onPress={pickImage}
            >
              <MaterialIcons
                name="photo-library"
                size={24}
                color={isDarkMode ? "#fff" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg ${
                  isDarkMode ? "text-white" : "text-gray-600"
                }`}
              >
                Choose from Library
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
