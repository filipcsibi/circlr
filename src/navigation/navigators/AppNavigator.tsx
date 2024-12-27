import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import AuthNavigator from "./AuthNavigator";
import { ActivityIndicator, View } from "react-native";

const AppNavigator: React.FC = () => {
  const { user } = useContext(UserContext) as UserContextType;
  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
