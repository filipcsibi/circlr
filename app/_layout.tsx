import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/components/login/LoginScreen";
import LandingScreen from "@/components/landingpage/LandingScreen";
import RegisterScreen from "@/components/login/RegisterScreen";
import MainFeed from "@/components/feed/MainFeed";
import { RootStackParamList } from "@/components/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootLayout() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="landingscreen" component={LandingScreen} />
        <Stack.Screen name="loginscreen" component={LoginScreen} />
        <Stack.Screen name="registerscreen" component={RegisterScreen} />
        <Stack.Screen name="feedscreen" component={MainFeed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
