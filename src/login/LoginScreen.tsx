// LoginScreen.tsx
import { Apple, Facebook, Google, Search400 } from "@/assets/svgs";
import { Authentication } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/routes/types";
import GoBackButton from "../navigation/GoBack";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = Authentication;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const SingIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate("tabnavigator");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };
  const SignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("Sign in success");
      navigation.navigate("tabnavigator");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <GoBackButton />
        <View style={{ justifyContent: "center", flex: 1 }}>
          <View style={styles.topflex}>
            <Text style={styles.welcome}>Welcome,</Text>
            <Text style={styles.glad}>Glad to see you!</Text>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <TextInput
              style={styles.placeholder}
              placeholder="Email Address"
              value={email}
              onChangeText={(email) => setEmail(email)}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.placeholder}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(password) => setPassword(password)}
              autoCapitalize="none"
            />
            <Text style={styles.forgot}>Forgot password?</Text>
          </KeyboardAvoidingView>
          {loading ? (
            <View style={styles.activity}>
              <ActivityIndicator size="small" color="gray" />
            </View>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={SingIn}
                activeOpacity={0}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.using}>Sign in using</Text>
          <View style={styles.socials}>
            <Facebook width={width * 0.22} height={height * 0.1} />
            <Google width={width * 0.22} height={height * 0.1} />
            <Apple width={width * 0.22} height={height * 0.1} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 16,
  },
  forgot: {
    alignSelf: "flex-end",
    fontWeight: "500",
  },
  using: {
    alignSelf: "center",
    fontWeight: "500",
  },
  placeholder: {
    backgroundColor: "white",
    height: height * 0.07,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A61515",
    padding: 8,
  },
  activity: {
    height: height * 0.07,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 48,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#A61515",
    height: height * 0.07,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 48,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontFamily: "Courier",
    fontSize: 20,
    fontWeight: "bold",
  },
  welcome: {
    color: "#A61515",
    alignSelf: "center",
    fontFamily: "Courier",
    fontSize: 28,
    fontWeight: "bold",
  },
  glad: {
    color: "#A61515",
    alignSelf: "center",
    fontFamily: "Courier",
    fontSize: 28,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  buttontext: {
    color: "#A61515",
    fontWeight: "bold",
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#A61515",
  },
  logo: {
    width: width * 0.2,
    height: height * 0.1,
  },
  topflex: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  irclr: {
    fontSize: 32,
    color: "#A61515",
    fontWeight: "bold",
    fontFamily: "Courier",
  },
});

export default LoginScreen;
