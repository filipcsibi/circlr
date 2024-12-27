import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Gallery } from "@/assets/svgs";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Storage } from "@/FirebaseConfig";
import * as Progress from "react-native-progress";
import { styles } from "../styles/stylesPost";
import { DataBase } from "@/FirebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { PostCardProps } from "@/src/feed/components/PostCard";
import { UserContext, UserContextType } from "@/src/login/UserContext";
const screenWidth = Dimensions.get("window").width;

export interface PostScreenRef {
  openPostModal: () => void;
  closePostModal: () => void;
}
const PostScreen = forwardRef<PostScreenRef>((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const inputRef = useRef<TextInput | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(UserContext) as UserContextType;
  const [imageHeight, setImageHeight] = useState<number>(0);

  const [userTag, setUserTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (user?.uid)
        try {
          const userRef = doc(DataBase, "users", user?.uid);

          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserTag(userData?.username);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user photo URL: ", error);
        }
    };
    fetchUserPhoto();
  }, []);

  useImperativeHandle(ref, () => ({
    openPostModal: () => {
      setModalVisible(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    },
    closePostModal: () => {
      setModalVisible(false);
      setPostContent("");
    },
  }));

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      Image.getSize(
        result.assets[0].uri,
        (width, height) => {
          const aspectRatio = height / width;
          const calculatedHeight = screenWidth * 0.76 * aspectRatio;
          setImageHeight(Math.min(calculatedHeight, screenWidth));
        },
        (error) => {
          console.error("Error fetching image dimensions:", error);
        }
      );
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);

      Image.getSize(
        result.assets[0].uri,
        (width, height) => {
          const aspectRatio = height / width;
          const calculatedHeight = screenWidth * 0.76 * aspectRatio;
          setImageHeight(Math.min(calculatedHeight, screenWidth));
        },
        (error) => {
          console.error("Error fetching image dimensions:", error);
        }
      );
    }
  };
  async function addPost(post: Omit<PostCardProps, "id">) {
    try {
      const docRef = await addDoc(collection(DataBase, "posts"), post);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const handlePost = async () => {
    Keyboard.dismiss();
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
    try {
      setUploading(true);
      setUploadProgress(0);

      const fileRef = storageRef(Storage, "posts/" + new Date().getTime());

      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(fileRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          setUploading(false);
          console.error("Error uploading image:", error);
        },
        async () => {
          console.log("Upload complete");
          const downloadURL = await getDownloadURL(fileRef);
          console.log("File available at:", downloadURL);

          addPost({
            userName: user?.displayName || "",
            userDescription: postContent,
            postImage: downloadURL,
            postTime: Date.now().toString(),
            userTag: userTag || "",
            likes: 0,
            likedBy: [],
            comments: 0,
            commented: [],
            favorite: [],
            shares: 0,
            shared: [],
            imageHeight: imageHeight,
          });

          setModalVisible(false);
          setPostContent("");
          setSelectedImage(null);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePost}
                style={styles.postButtonTouchable}
              >
                <Text style={styles.postButton}>Post</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.photoBar}>
              <TouchableOpacity onPress={takePhoto}>
                <Camera width={40} height={40} />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage}>
                <Gallery width={40} height={40} />
              </TouchableOpacity>
            </View>
            <TextInput
              ref={inputRef}
              multiline
              style={styles.input}
              placeholder="What's on your mind?"
              value={postContent}
              onChangeText={setPostContent}
            />
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: screenWidth * 0.76,
                  height: imageHeight,
                  alignSelf: "center",
                  borderRadius: 10,
                  margin: 6,
                }}
                resizeMode="cover"
              />
            )}
            {uploading && (
              <View style={styles.uploadingContainer}>
                <Text>Uploading: {uploadProgress}%</Text>
                <Progress.Bar progress={uploadProgress / 100} color="#A61515" />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
});

export default PostScreen;
