import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../components/ThemeContext";
import axios from "../../utils/axios";
import { useRouter } from "expo-router";

interface BuySuggestion {
  thumbnail: string;
  source_logo: string;
  price: string;
  link: string;
  title: string;
}

interface Item {
  _id: string;
  image: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  items?: Item[];
  buy_suggestions?: BuySuggestion[];
}

export default function ChatScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post("/chat/", {
        prompt: inputText,
        suggest: showSuggestions,
      });

      const outfit = response.data[0];
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: outfit.description,
        isUser: false,
        items: outfit.items,
        buy_suggestions: showSuggestions ? outfit.buy_suggestions : undefined,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = (itemId: string) => {
    router.push(`/item/${itemId}`);
  };

  const handleBuySuggestionPress = async (link: string) => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        Alert.alert(
          "Cannot Open Link",
          "This link cannot be opened on your device."
        );
      }
    } catch (error) {
      console.error("Error opening link:", error);
      Alert.alert("Error", "Failed to open the link. Please try again.");
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      className={`flex-row ${
        message.isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <View
        className={`max-w-[80%] rounded-2xl p-4 ${
          message.isUser
            ? isDarkMode
              ? "bg-indigo-600"
              : "bg-indigo-500"
            : isDarkMode
            ? "bg-gray-800"
            : "bg-gray-100"
        }`}
      >
        <Text
          className={`${
            message.isUser
              ? "text-white"
              : isDarkMode
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          {message.text}
        </Text>

        {message.items && message.items.length > 0 && (
          <View className="mt-4">
            {message.items.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => handleItemPress(item._id)}
                className="mb-2"
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {message.buy_suggestions && message.buy_suggestions.length > 0 && (
          <View className="mt-4">
            <Text
              className={`text-sm font-semibold mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Buy suggestions:
            </Text>
            {message.buy_suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleBuySuggestionPress(suggestion.link)}
                className={`flex-row items-center mb-2 p-2 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <Image
                  source={{ uri: suggestion.thumbnail }}
                  className="w-16 h-16 rounded-lg"
                  resizeMode="cover"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                    numberOfLines={2}
                  >
                    {suggestion.title}
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {suggestion.price}
                  </Text>
                </View>
                <Image
                  source={{ uri: suggestion.source_logo }}
                  className="w-8 h-8 ml-2"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View className="flex-row justify-start mb-4">
              <View
                className={`max-w-[80%] rounded-2xl p-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <ActivityIndicator size="small" color="#6366F1" />
              </View>
            </View>
          )}
        </ScrollView>

        <View
          className={`p-4 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => setShowSuggestions(!showSuggestions)}
              className={`flex-row items-center px-3 py-1 rounded-full ${
                showSuggestions
                  ? isDarkMode
                    ? "bg-indigo-600"
                    : "bg-indigo-500"
                  : isDarkMode
                  ? "bg-gray-800"
                  : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name={showSuggestions ? "shopping-cart" : "shopping-bag"}
                size={20}
                color={
                  showSuggestions ? "white" : isDarkMode ? "#9CA3AF" : "#6B7280"
                }
              />
              <Text
                className={`ml-2 text-sm ${
                  showSuggestions
                    ? "text-white"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {showSuggestions ? "Buy Suggestions On" : "Buy Suggestions Off"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <TextInput
              className={`flex-1 mr-2 p-3 rounded-full ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              placeholder="Type a message..."
              placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSend}
              className={`p-3 rounded-full ${
                isDarkMode ? "bg-indigo-600" : "bg-indigo-500"
              }`}
            >
              <MaterialIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
