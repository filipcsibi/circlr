import { UserContext, UserContextType } from "@/src/login/UserContext";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { DataBase, Storage } from "@/FirebaseConfig";
const { width, height } = Dimensions.get("window");
import * as Progress from "react-native-progress";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import EditProfileModal from "./EditProfileModule";
import { LogoutButton } from "@/assets/svgs";

const ProfileScreen = () => {
  const { user, logout } = useContext(UserContext) as UserContextType;
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const blankProfilePicture = require("../../../assets/images/ProfileBlank.png");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      handleProfilePicture(result.assets[0].uri);
    }
  };

  const handleProfilePicture = async (uri: string) => {
    if (!uri) {
      console.error("No image selected");
      return;
    }
    if (!user) {
      console.log("no user");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const userDocRef = doc(DataBase, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        if (userData?.profilePicture) {
          const previousImageRef = storageRef(Storage, userData.profilePicture);
          await deleteObject(previousImageRef);
          console.log("previous deleted");
        } else {
          console.log("error");
        }
      } else {
        console.log("error");
      }
      const fileRef = storageRef(
        Storage,
        "profilePictures/" + new Date().getTime()
      );
      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          setUploading(false);
          console.error("Upload error:", error);
        },
        async () => {
          console.log("Upload complete");
          const downloadURL = await getDownloadURL(fileRef);
          setProfilePicture(downloadURL);
          console.log("File available at:", downloadURL);

          const userDocRef = doc(DataBase, "users", user.uid);
          await updateDoc(userDocRef, {
            profilePicture: downloadURL,
          });

          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsQuery = query(
        collection(DataBase, "posts"),
        orderBy("postTime", "desc")
      );

      const snapshot = await getDocs(postsQuery);

      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPost = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity style={styles.postContainer}>
      <Image
        source={{ uri: item.postImage }}
        style={styles.postImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
  useEffect(() => {
    if (!user) {
      console.log("useeffecterror");
      return;
    }
    const getProfilePic = async () => {
      try {
        const userDocRef = doc(DataBase, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists())
          setProfilePicture(userSnapshot.data().profilePicture);
      } catch (error) {
        console.log(error);
      }
    };
    getProfilePic();
    fetchPosts();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topSection, { height: height * 0.35 }]}>
        <LogoutButton
          width={32}
          height={32}
          onPress={() => logout()}
          style={{ alignSelf: "flex-end", marginRight: 20 }}
        />
        {!uploading ? (
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                profilePicture
                  ? {
                      uri: profilePicture,
                    }
                  : blankProfilePicture
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.uploadingContainer}>
            <Text>Uploading: {uploadProgress}%</Text>
            <Progress.Bar progress={uploadProgress / 100} color="#A61515" />
          </View>
        )}
        <Text style={styles.userName}>{user?.displayName}</Text>
        <Text style={styles.userDescription}>
          Developer | Tech Enthusiast | Coffee Lover
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setIsEditModalVisible(true);
          }}
        >
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postsGrid}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  postsGrid: {
    backgroundColor: "#fff",
    marginTop: 1,
  },
  uploadingContainer: {
    height: width * 0.3,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#A61515",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#A61515",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
