import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const AuthScreen = ({ isSignup = false }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <TextInput
          className="w-full bg-dark-100 p-4 rounded-xl mb-4 text-light-100 border border-light-300/20"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="w-full bg-dark-100 p-4 rounded-xl mb-6 text-light-100 border border-light-300/20"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="w-full bg-primary p-4 rounded-xl mb-4 shadow-lg"
          style={{ elevation: 3 }}
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
