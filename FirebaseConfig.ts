// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { Persistence } from "@react-native-firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVVA2dDGYBJcL_pLFD8cytADaNFx6jQq8",
  authDomain: "circlr-bd915.firebaseapp.com",
  projectId: "circlr-bd915",
  storageBucket: "circlr-bd915.appspot.com",
  messagingSenderId: "165235623937",
  appId: "1:165235623937:web:b75ac3bf9bc828351b5800",
  measurementId: "G-0D03NYPLN1",
};

// Initialize Firebase
export const APP_FIREBASE = initializeApp(firebaseConfig);
export const Authentication = initializeAuth(APP_FIREBASE, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const DataBase = getFirestore(APP_FIREBASE);
