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
  Alert,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";

import React, { useContext, useEffect, useState } from "react";
import { CommentProps, PostCardProps } from "./PostCard";
import {
  Comment,
  DeletePost,
  Dot,
  Fav,
  FavFill,
  Heart,
  HeartFill,
} from "@/assets/svgs";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import { DataBase, Storage } from "@/FirebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { timeAgo } from "../services/timeAgo";
import { deleteObject, ref } from "firebase/storage";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

interface PostDetailsProps extends PostCardProps {
  visible: boolean;
  postProfilePic: string | null;
  liked: boolean;
  nrLikes: number;
  nrComms: number;
  onLike: () => void;
  onComment: () => void;
  onClose: () => void;
  onFavorite: () => void;
  faved: boolean;
}
const PostDetails: React.FC<PostDetailsProps> = ({
  visible,
  postProfilePic,
  liked,
  nrLikes,
  nrComms,
  onClose,
  onLike,
  onComment,
  onFavorite,
  faved,
  ...props
}) => {
  const blankProfilePicture = require("../../../assets/images/ProfileBlank.png");

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(props.commented);
  const [comCountState, setComCountState] = useState(props.comments);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [userTag, setUserTag] = useState<string | null>(null);

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
      onComment();
      console.log("comment added");
      setComments(updatedComments);
      setComCountState(updatedComments.length);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  const handleDelete = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const imageRef = ref(Storage, props.postImage); // props.postImage should be the full path of the image in storage
            await deleteObject(imageRef);
            const postDocRef = doc(DataBase, "posts", props.id);
            await deleteDoc(postDocRef);
            onClose();
            Alert.alert("Success", "Post deleted successfully!");
          } catch (error) {
            console.error("Error deleting post: ", error);
            Alert.alert("Error", "Failed to delete the post.");
          }
        },
      },
    ]);
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
          setUserTag(userDoc?.username);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.topPart}>
                <Image
                  source={
                    postProfilePic
                      ? { uri: postProfilePic }
                      : blankProfilePicture
                  }
                  style={styles.profileImage}
                />
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.username}>{props.userName}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.usertag}>@{props.userTag} </Text>
                    <Dot width={4} height={4} />
                    <Text> </Text>
                    <Text style={styles.postTime}>
                      {timeAgo(props.postTime)}
                    </Text>
                  </View>
                </View>
                {userTag === props.userTag && (
                  <DeletePost width={32} height={32} onPress={handleDelete} />
                )}
              </View>

              <View style={styles.mainContent}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: props.postImage }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                  <View style={styles.stats}>
                    <View style={styles.heartCom}>
                      {!liked ? (
                        <Heart width={24} height={24} onPress={onLike} />
                      ) : (
                        <HeartFill width={24} height={24} onPress={onLike} />
                      )}
                      {nrLikes !== 0 && (
                        <Text style={styles.statItem}>{nrLikes}</Text>
                      )}
                    </View>
                    <View style={styles.heartCom}>
                      <Comment width={24} height={24} />
                      {nrComms !== 0 && (
                        <Text style={styles.statItem}>{nrComms}</Text>
                      )}
                    </View>
                    <View style={styles.heartCom}>
                      {!faved ? (
                        <Fav width={24} height={24} onPress={onFavorite} />
                      ) : (
                        <FavFill width={24} height={24} onPress={onFavorite} />
                      )}
                    </View>
                  </View>
                </View>

                {/* Comments section */}
                <ScrollView style={styles.commentsSection}>
                  {comments.map((comment, index) => (
                    <View key={index} style={styles.commentContainer}>
                      <Image
                        source={
                          comment.profilePicture
                            ? { uri: comment.profilePicture }
                            : blankProfilePicture
                        }
                        style={styles.profileImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.commentText}>
                        {comment.displayName}: {comment.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.bottomPart}>
                <TextInput
                  placeholder="Add a comment..."
                  style={styles.comInput}
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity
                  style={styles.comButton}
                  onPress={handleAddComment}
                >
                  <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </GestureRecognizer>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContent: {
    flex: 1,
    padding: 4,
  },
  imageContainer: {
    alignItems: "center",
  },
  commentsSection: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  commentText: {
    flex: 1,
    flexWrap: "wrap",
  },
  commText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#A61515",
    borderColor: "#ddd",
    width: width * 0.8,
    borderBottomWidth: 1,
    textAlign: "center",
  },
  heartCom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 2,
  },
  postText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#A61515",
  },
  comButton: {
    width: width * 0.16,
    height: width * 0.12,
    borderRadius: 20,
    paddingRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPart: {
    padding: 2,
    margin: 8,
    flexDirection: "row",
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "space-between",
    borderRadius: 30,
    backgroundColor: "white",
  },
  comInput: {
    padding: 10,
    width: width * 0.8,
    height: width * 0.12,
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
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    padding: 4,
  },
  statItem: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
});
