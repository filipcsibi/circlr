import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import AuthNavigator from "./AuthNavigator";
import { ActivityIndicator, View } from "react-native";

const AppNavigator: React.FC = () => {
  const { user } = useContext(UserContext) as UserContextType;
  const [init, setInit] = useState(true);
  useEffect(() => {
    if (user) setInit(false);
  }, [user]);

  return (
    <NavigationContainer>
      {init ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <ActivityIndicator size="large" color="#A61515" />
        </View>
      ) : user ? (
        <TabNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
