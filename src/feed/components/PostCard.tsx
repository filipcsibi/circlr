import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // or use another icon library
import { Comment, Dot, Fav, Heart, Share } from "@/assets/svgs";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import { Authentication, DataBase } from "@/FirebaseConfig";
import { getAdditionalUserInfo, getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
const { width, height } = Dimensions.get("window");

export interface PostCardProps {
  userName: string;
  userTag: string;
  postImage: string;
  postTime: string;
  userDescription: string;
  likes: string;
  liked: boolean;
  comments: string;
  favorite: boolean;
}

const PostCard: React.FC<PostCardProps> = (props) => {
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  const updateProfilePicture = async () => {
    try {
      const userDocRef = doc(DataBase, "users", props.userTag);
      await updateDoc(userDocRef, {
        profilePicture: userPhotoURL,
      });
      console.log("Profile picture updated successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        // Assuming you're using Firebase Authentication to get user details

        const userRef = collection(DataBase, "users");

        const q = query(userRef, where("username", "==", props.userTag)); // Fetch user by UID (userTag)
        console.log(props.userTag);
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          setUserPhotoURL(userDoc?.profilePicture);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user photo URL: ", error);
      }
    };

    fetchUserPhoto();
  }, [props.userTag]);
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: width * 0.02,
          marginBottom: 6,
        }}
      >
        <Image
          source={{
            uri: userPhotoURL || "http://www.example.com/12345678/photo.png",
          }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.username}>{props.userName}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.usertag}>@{props.userTag} </Text>
            <Dot width={4} height={4} />
            <Text style={styles.postTime}> {props.postTime}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            width: width * 0.76,
          }}
        >
          <Text style={styles.caption}>{props.userDescription}</Text>
          <Image source={{ uri: props.postImage }} style={styles.postImage} />
          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Heart width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Comment width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Share width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Fav width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  usertag: {
    fontSize: 12,
    color: "#666",
  },
  postTime: {
    fontSize: 12,
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    overflow: "hidden",
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: width * 0.76,
    height: width * 0.76, // Square image
    borderRadius: 12,
    resizeMode: "cover",
  },
  footer: {
    padding: 8,
  },
  iconRow: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 16,
    color: "black",
  },
  caption: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default PostCard;
