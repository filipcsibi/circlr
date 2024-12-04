import React, { useContext } from "react";
import AppNavigator from "@/src/navigation/navigators/AppNavigator";
import { UserProvider } from "@/src/login/UserContext";

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
