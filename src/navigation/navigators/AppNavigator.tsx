import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { Authentication } from "@/FirebaseConfig";
import { ActivityIndicator, View } from "react-native";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import AuthNavigator from "./AuthNavigator";
import { User } from "firebase/auth";

const AppNavigator: React.FC = () => {
  const { user, setUser } = useContext(UserContext) as UserContextType;
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged1 = (user: User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = Authentication.onAuthStateChanged(onAuthStateChanged1);
    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A61515" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
