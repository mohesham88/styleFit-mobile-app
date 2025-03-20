import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
<<<<<<< HEAD
import AsyncStorage from "@react-native-async-storage/async-storage";

import instance from "../../utils/axios";

import axios from "axios";
=======
import instance, { setAuthToken } from "../../utils/axios";
>>>>>>> 334e78f9087872647e2e5323f5560cbe23abf81e

interface AuthData {
  email?: string;
  username: string;
  password: string;
  gender?: "male" | "female" | "other";
}

const AuthScreen = ({ isSignup = false }) => {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData>({
    email: "",
    username: "",
    password: "",
    gender: undefined,
  });

  const handleSignIn = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.post("http://10.0.3.2:8080/auth/login/", {
=======
      const response = await instance.post("/auth/login/", {
>>>>>>> 334e78f9087872647e2e5323f5560cbe23abf81e
        username: authData.username,
        password: authData.password,
      });

<<<<<<< HEAD
      console.log(response);

      if (response.data?.token) {
        const token = response.data.token;

        // Save token to AsyncStorage
        await AsyncStorage.setItem("authToken", token);

        // Set token in Axios defaults
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        router.replace("/(tabs)/closet");
=======
      console.log(response.data.token);
      if (response.data.token) {
        await setAuthToken(response.data.token);
        router.replace("/(tabs)/chat");
>>>>>>> 334e78f9087872647e2e5323f5560cbe23abf81e
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await instance.post("/auth/register/", {
        email: authData.email,
        username: authData.username,
        password: authData.password,
        gender: authData.gender,
      });

      if (response.data) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/login"),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleAuth = async () => {
    // Basic validation
    if (!authData.username.trim() || !authData.password.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isSignup) {
      if (!authData.email?.trim() || !authData.gender) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(authData.email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  return (
    <View className="flex-1 bg-dark-200 p-6">
      {/* Header Section */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl font-bold text-accent mb-2">StyleFit</Text>
        <Text className="text-light-100 text-lg mb-8">
          {isSignup ? "Create your account" : "Welcome back"}
        </Text>
      </View>

      {/* Form Section */}
      <View className="flex-1 justify-center">
        {isSignup && (
          <TextInput
            className="w-full bg-dark-100 p-4 rounded-xl mb-4 text-light-100 border border-light-300/20"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={authData.email}
            onChangeText={(text) =>
              setAuthData((prev) => ({ ...prev, email: text }))
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <TextInput
          className="w-full bg-dark-100 p-4 rounded-xl mb-4 text-light-100 border border-light-300/20"
          placeholder="Username"
          placeholderTextColor="#9CA3AF"
          value={authData.username}
          onChangeText={(text) =>
            setAuthData((prev) => ({ ...prev, username: text }))
          }
          autoCapitalize="none"
        />

        {isSignup && (
          <View className="flex-row justify-between mb-4">
            {["male", "female", "other"].map((gender) => (
              <TouchableOpacity
                key={gender}
                className={`px-6 py-3 rounded-xl ${
                  authData.gender === gender
                    ? "bg-accent"
                    : "bg-dark-100 border border-light-300/20"
                }`}
                onPress={() =>
                  setAuthData((prev) => ({
                    ...prev,
                    gender: gender as "male" | "female" | "other",
                  }))
                }
              >
                <Text
                  className={`capitalize ${
                    authData.gender === gender ? "text-white" : "text-light-100"
                  }`}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          className="w-full bg-dark-100 p-4 rounded-xl mb-6 text-light-100 border border-light-300/20"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={authData.password}
          onChangeText={(text) =>
            setAuthData((prev) => ({ ...prev, password: text }))
          }
        />

        <TouchableOpacity
          className="w-full bg-primary p-4 rounded-xl mb-4 shadow-lg"
          style={{ elevation: 3 }}
          onPress={handleAuth}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isSignup ? "Create Account" : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push(isSignup ? "/(auth)/login" : "/(auth)/signup")
          }
          className="py-2"
        >
          <Text className="text-accent text-center">
            {isSignup
              ? "Already have an account? Sign In"
              : "Don't have an account? Create Account"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View className="py-6">
        <Text className="text-light-300 text-center text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default AuthScreen;
