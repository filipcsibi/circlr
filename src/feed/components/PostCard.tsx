import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { Comment, Dot, Fav, FavFill, Heart, HeartFill } from "@/assets/svgs";
import { DataBase } from "@/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { UserContext, UserContextType } from "@/src/login/UserContext";
import PostDetails from "./PostDetails";
import { timeAgo } from "../services/timeAgo";
const { width } = Dimensions.get("window");
export interface CommentProps {
  text: string;
  displayName: string;
  profilePicture: string | null;
}

export interface PostCardProps {
  id: string;
  userName: string;
  userTag: string;
  postImage: string;
  postTime: string;
  userDescription: string;
  likes: number;
  likedBy: string[];
  comments: number;
  commented: CommentProps[];
  favorite: string[];
  shares: number;
  shared: string[];
  imageHeight: number;
}
const PostCard: React.FC<PostCardProps> = (props) => {
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [isLikedState, setIsLikedState] = useState(false);
  const [isFav, setFavState] = useState(false);
  const [likeCountState, setLikeCountState] = useState(props.likes);
  const [comCountState, setComCountState] = useState(props.comments);
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useContext(UserContext) as UserContextType;
  const blankProfilePicture = require("../../../assets/images/ProfileBlank.png");
  const handleFavorite = async () => {
    if (!user?.uid) return;
    const newFav = !isFav;
    try {
      setFavState(newFav);

      const postDocRef = doc(DataBase, "posts", props.id);
      const updatedFav = newFav
        ? [...props.favorite, user.uid]
        : props.favorite.filter((uid) => uid !== user.uid);

      await updateDoc(postDocRef, {
        favorite: updatedFav,
      });
    } catch (error) {
      console.error("Failed to update likes: ", error);

      setFavState(!newFav);
    }
  };

  const handleLike = async () => {
    if (!user?.uid) return;

    const newIsLiked = !isLikedState;
    const updatedLikes = newIsLiked ? likeCountState + 1 : likeCountState - 1;

    try {
      setIsLikedState(newIsLiked);
      setLikeCountState(updatedLikes);

      const postDocRef = doc(DataBase, "posts", props.id);
      const updatedLikedBy = newIsLiked
        ? [...props.likedBy, user.uid]
        : props.likedBy.filter((uid) => uid !== user.uid);

      await updateDoc(postDocRef, {
        likedBy: updatedLikedBy,
        likes: Number(updatedLikes),
      });
    } catch (error) {
      console.error("Failed to update likes: ", error);

      setIsLikedState(!newIsLiked);
      setLikeCountState(likeCountState);
    }
  };

  const openDetails = () => {
    setModalVisible(true);
  };
  const closeDetails = () => setModalVisible(false);

  useEffect(() => {
    if (user?.uid) {
      setIsLikedState(props.likedBy.includes(user.uid));
      setFavState(props.favorite.includes(user.uid));
    } else {
      setIsLikedState(false);
      setFavState(false);
    }

    setLikeCountState(Number(props.likes));
  }, [props.likedBy, props.likes, user?.uid]);

  useEffect(() => {
    console.log(user?.displayName);
    const fetchUserPhoto = async () => {
      try {
        const userRef = collection(DataBase, "users");

        const q = query(userRef, where("username", "==", props.userTag));
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
    <>
      <TouchableOpacity onPress={openDetails} activeOpacity={1}>
        <View style={styles.card}>
          <View style={styles.topPart}>
            <Image
              source={
                userPhotoURL
                  ? {
                      uri: userPhotoURL,
                    }
                  : blankProfilePicture
              }
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.username}>{props.userName}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.usertag}>@{props.userTag} </Text>
                <Dot width={4} height={4} />
                <Text style={styles.postTime}> {timeAgo(props.postTime)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomPart}>
            <View
              style={{
                width: width * 0.76,
              }}
            >
              <Text style={styles.caption}>{props.userDescription}</Text>

              <Image
                source={{ uri: props.postImage }}
                style={{
                  width: width * 0.76,
                  height: props.imageHeight,
                  borderRadius: 12,
                }}
                resizeMode="cover"
              />
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.likeCommShare}
                  onPress={handleLike}
                >
                  {isLikedState ? (
                    <HeartFill width={24} height={24} />
                  ) : (
                    <Heart width={24} height={24} />
                  )}
                  {likeCountState !== 0 && (
                    <Text style={styles.numbLikes}>{likeCountState}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeCommShare}>
                  <Comment width={24} height={24} />
                  {comCountState !== 0 && (
                    <Text style={styles.numbLikes}>{comCountState}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFavorite}>
                  {isFav ? (
                    <FavFill width={24} height={24} />
                  ) : (
                    <Fav width={24} height={24} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <PostDetails
        onLike={handleLike}
        visible={modalVisible}
        postProfilePic={userPhotoURL}
        liked={isLikedState}
        onClose={closeDetails}
        nrComms={comCountState}
        nrLikes={likeCountState}
        onComment={() => setComCountState(comCountState + 1)}
        onFavorite={handleFavorite}
        faved={isFav}
        {...props}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomPart: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  topPart: {
    flexDirection: "row",
    alignItems: "center",
    margin: width * 0.02,
    marginBottom: 6,
  },
  likeCommShare: {
    width: width * 0.1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  numbLikes: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
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
