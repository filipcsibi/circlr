import React from "react";
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
const { width, height } = Dimensions.get("window");

export interface PostCardProps {
  id: string;
  userImage: string;
  userName: string;
  userTag: string;
  postImage: string;
  postTime: string;
  userDescription: string;
  likes: string;
  liked: boolean;
  comments: string;
}

const PostCard: React.FC<PostCardProps> = (props) => {
  const postImage = "https://picsum.photos/200/300"; // Example post image (replace with real image URLs)
  const profileImage = "https://picsum.photos/200/300"; // Example profile image (replace with real image URLs)

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
        <Image source={{ uri: props.userImage }} style={styles.profileImage} />
        <View>
          <Text style={styles.username}>{props.userName}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.usertag}>{props.userTag} </Text>
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
