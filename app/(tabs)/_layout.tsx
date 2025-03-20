import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../../components/ThemeContext";

export default function TabLayout() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? "#818cf8" : "#6366f1",
        tabBarInactiveTintColor: isDarkMode ? "#64748b" : "#94a3b8",
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        },
        headerStyle: {
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        },
        headerTitleStyle: {
          color: isDarkMode ? "#f3f4f6" : "#1f2937",
        },
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} className="mr-4">
            <MaterialIcons
              name={isDarkMode ? "light-mode" : "dark-mode"}
              size={24}
              color={isDarkMode ? "#f3f4f6" : "#1f2937"}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checkroom" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
