// LoginScreen.tsx
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
} from "react-native";
const { width, height } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = Authentication;

  const SingIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
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
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };
  const Logo = require("../../assets/images/logo.png");
  return (
    <View style={styles.container}>
      <View style={styles.topflex}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.irclr}>irclr</Text>
      </View>

      <View style={styles.bottomflex}>
        <View
          style={{
            flex: 0.8,
          }}
        >
          <Text style={styles.heyyou}>Hey you!</Text>
          <Text style={styles.quote}>
            Dive into the unknown and uncover the secrets of your surroundings.
          </Text>
          <TouchableOpacity style={styles.touchable}>
            <Text style={styles.buttontext}>Are you in?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable2}>
            <Text style={styles.learnmore}>Learn More</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            flex: 0.2,
          }}
        >
          <Text style={styles.login}>I already have an account.</Text>
        </View>
        {/* <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
        /> */}
      </View>

      {/* <Text style={styles.title}>Login</Text> */}
      {/*
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <TouchableOpacity style={styles.button} onPress={SingIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={SignUp}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "white",
  },
  buttontext: {
    color: "#A61515",
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "Courier",
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
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  irclr: {
    fontSize: 32,
    color: "#A61515",
    fontWeight: "bold",
    fontFamily: "Courier",
  },
  bottomflex: {
    backgroundColor: "#A61515",
    flex: 0.6,
    borderRadius: 50,
    padding: 16,
    paddingBottom: 0,
    justifyContent: "space-between",
  },
  touchable: {
    backgroundColor: "white",
    height: height * 0.07,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  touchable2: {
    backgroundColor: "#15A664",
    height: height * 0.07,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  quote: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Courier",
    marginBottom: 32,
    textAlign: "center",
  },
  login: {
    color: "white",
    alignSelf: "center",
    fontFamily: "Courier",
    fontSize: 16,
    fontWeight: "bold",
  },
  learnmore: {
    color: "white",
    alignSelf: "center",
    fontFamily: "Courier",
    fontSize: 24,
    fontWeight: "bold",
  },
  heyyou: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Courier",
    textAlign: "center",
    marginVertical: 32,
  },
});

export default LoginScreen;
