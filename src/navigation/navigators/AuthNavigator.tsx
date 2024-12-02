import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";
import LandingScreen from "@/src/login/LandingScreen";
import LoginScreen from "@/src/login/LoginScreen";
import RegisterScreen from "@/src/login/RegisterScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="landingscreen" component={LandingScreen} />
      <Stack.Screen name="loginscreen" component={LoginScreen} />
      <Stack.Screen name="registerscreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
export default AuthNavigator;
