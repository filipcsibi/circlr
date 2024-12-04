import { UserContext, UserContextType } from "@/src/login/UserContext";

import React, { useContext } from "react";
import { View, Text } from "react-native";
const SearchScreen: React.FC = () => {
  const { user } = useContext(UserContext) as UserContextType;

  return (
    <View style={{ backgroundColor: "red", flex: 1 }}>
      <Text>{user?.email}</Text>
    </View>
  );
};
export default SearchScreen;
