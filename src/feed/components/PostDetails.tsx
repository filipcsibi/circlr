import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

import React, { useContext, useEffect, useState } from "react";
import { CommentProps, PostCardProps } from "./PostCard";
import { Comment, Dot, Heart } from "@/assets/svgs";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import { DataBase } from "@/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

interface PostDetailsProps extends PostCardProps {
  visible: boolean;
  postProfilePic: string | null;
  onClose: () => void;
}
const PostDetails: React.FC<PostDetailsProps> = ({
  visible,
  postProfilePic,
  onClose,
  ...props
}) => {
  const blankProfilePicture = require("../../../assets/images/ProfileBlank.png");
  function timeAgo(postTimeString: string) {
    const postTime = parseInt(postTimeString, 10);
    const now = Date.now();
    const secondsAgo = Math.floor((now - postTime) / 1000);

    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} hours ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) return `${daysAgo} days ago`;
    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) return `${weeksAgo} weeks ago`;
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) return `${monthsAgo} months ago`;
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo} years ago`;
  }

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(props.commented);
  const [comCountState, setComCountState] = useState(props.comments);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  const { user } = useContext(UserContext) as UserContextType;
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user?.uid) return;

    try {
      const postDocRef = doc(DataBase, "posts", props.id);
      const updatedComments = [
        ...comments,
        {
          text: newComment,
          displayName: user.displayName || "Anonymous",
          profilePicture: userPhotoURL || null,
        },
      ];

      await updateDoc(postDocRef, {
        commented: updatedComments,
        comments: updatedComments.length,
      });

      console.log("comment added");
      setComments(updatedComments);
      setComCountState(updatedComments.length);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const userRef = collection(DataBase, "users");

        const q = query(userRef, where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          setUserPhotoURL(userDoc?.profilePicture);
        } else {
          console.error("No such document!");
          setUserPhotoURL(null);
        }
      } catch (error) {
        console.error("Error fetching user photo URL: ", error);
        setUserPhotoURL(null);
      }
    };
    fetchUserPhoto();
  }, [props.userTag]);
  return (
    <GestureRecognizer style={{ flex: 1 }} onSwipeDown={onClose}>
      <Modal visible={visible} animationType="slide" transparent={false}>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View style={styles.topPart}>
            <Image
              source={
                postProfilePic
                  ? {
                      uri: postProfilePic,
                    }
                  : blankProfilePicture
              }
              style={styles.profileImage}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text style={styles.username}>{props.userName}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.usertag}>@{props.userTag} </Text>
                <Dot width={4} height={4} />
                <Text style={styles.postTime}> {timeAgo(props.postTime)}</Text>
              </View>
            </View>
          </View>

          <ScrollView
            scrollEnabled={false}
            contentContainerStyle={{
              alignItems: "center",
            }}
            style={{ flexGrow: 0 }}
          >
            <Image
              source={{ uri: props.postImage }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.stats}>
              <View style={styles.heartCom}>
                <Heart width={24} height={24} />
                <Text style={styles.statItem}>{props.likes}</Text>
              </View>
              <View style={styles.heartCom}>
                <Comment width={24} height={24} />
                <Text style={styles.statItem}>{props.comments}</Text>
              </View>
            </View>
          </ScrollView>
          <ScrollView style={{ flex: 1, padding: 4 }}>
            {comments.map((comment, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={
                      comment.profilePicture
                        ? {
                            uri: comment.profilePicture,
                          }
                        : blankProfilePicture
                    }
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>
                    {comment.displayName}: {comment.text}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.bottomPart}>
              <TextInput
                placeholder="Add a comment..."
                style={styles.comInput}
                value={newComment}
                onChangeText={setNewComment}
              ></TextInput>
              <TouchableOpacity
                style={styles.comButton}
                onPress={handleAddComment}
              >
                <Text style={styles.postText}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </GestureRecognizer>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  heartCom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 4,
  },
  postText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  comButton: {
    width: width * 0.16,
    height: width * 0.14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPart: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comInput: {
    padding: 8,
    width: width * 0.74,
    height: width * 0.14,
    borderColor: "#666666",
    borderWidth: 1,
    borderRadius: 20,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 20,
    marginRight: 8,
  },
  topPart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: width * 0.02,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 16,
    color: "#007AFF",
  },
  content: {
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  usertag: {
    fontSize: 14,
    color: "#666",
  },
  postTime: {
    fontSize: 12,
    color: "#999",
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  postImage: {
    width: width,
    height: height * 0.5,
  },
  stats: {
    flexDirection: "row",
    width: "100%",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    fontSize: 16,
    fontWeight: "500",
  },
});
