import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/src/login/LoginScreen";
import RegisterScreen from "@/src/login/RegisterScreen";
import { RootStackParamList } from "@/src/navigation/routes/types";
import TabNavigator from "./TabNavigator";
import LandingScreen from "@/src/login/LandingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen name="landingscreen" component={LandingScreen} />
        <Stack.Screen name="loginscreen" component={LoginScreen} />
        <Stack.Screen name="registerscreen" component={RegisterScreen} />
        <Stack.Screen name="tabnavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
