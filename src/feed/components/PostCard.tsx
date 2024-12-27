import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
const { width } = Dimensions.get("window");

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
  commented: string[];
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

  const { user } = useContext(UserContext) as UserContextType;
  const blankProfilePicture = require("../../../assets/images/ProfileBlank.png");
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

  return (
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
            <TouchableOpacity style={styles.likeCommShare} onPress={handleLike}>
              {isLikedState ? (
                <HeartFill width={22} height={22} />
              ) : (
                <Heart width={22} height={22} />
              )}
              {likeCountState !== 0 && (
                <Text style={styles.numbLikes}>{likeCountState}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeCommShare}>
              <Comment width={22} height={22} />
              {comCountState !== 0 && (
                <Text style={styles.numbLikes}>{props.comments}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavorite}>
              {isFav ? (
                <FavFill width={22} height={22} />
              ) : (
                <Fav width={22} height={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
