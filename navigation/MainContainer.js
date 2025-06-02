import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ContactList from "./screens/ContactList";
import ProfileScreen from "./screens/ProfileScreen";
import UploadScreen from "./screens/UploadScreen";
// Screen names
const homeName = "Home";
const contactName = "Contacts";
const uploadName = "Upload";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a stack navigator for ContactStack
function ContactStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactList"
        component={ContactList}
        options={{ headerShown: false }} // Keep header hidden for ContactList
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: "Profile", headerShown: true }} // Show header for ProfileScreen
      />
    </Stack.Navigator>
  );
}

function MainContainer() {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    console.log("User logged out");
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === contactName) {
              iconName = focused ? "list" : "list-outline";
            } else if (rn === uploadName) {
              iconName = focused ? "cloud-upload" : "cloud-upload-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "grey",
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
          tabBarStyle: { display: "flex" },
        })}
      >
        <Tab.Screen
          name={homeName}
          children={() => (
            <HomeScreen user={user} handleLogout={handleLogout} />
          )}
        />
        {/* Now use ContactStack for the "Contact" tab */}
        <Tab.Screen name={contactName} component={ContactStack} />
        <Tab.Screen name={uploadName} component={UploadScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
