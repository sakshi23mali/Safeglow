import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CameraScreen from "./screens/CameraScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProductLoadingScreen from "./screens/ProductLoadingScreen";
import ProductScreen from "./screens/ProductScreen";
import QuizScreen from "./screens/QuizScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#f5f5f5" },
          headerTintColor: "#333",
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />

        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: "Take Skin Photo" }}
        />

        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: "Skin Type Quiz" }}
        />

        <Stack.Screen
          name="ProductLoading"
          component={ProductLoadingScreen}
          options={{ title: "Please Wait..." }}
        />

        <Stack.Screen
          name="Products"
          component={ProductScreen}
          options={{ title: "Product Suggestions" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





