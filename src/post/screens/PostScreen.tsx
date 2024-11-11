import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Button,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Gallery } from "@/assets/svgs";
const { width } = Dimensions.get("window");
import { Storage } from "@/FirebaseConfig";

export interface PostScreenRef {
  openPostModal: () => void;
  closePostModal: () => void;
}
const PostScreen = forwardRef<PostScreenRef>((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const inputRef = useRef<TextInput | null>(null); // pt a refui textinput
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const handlePost = async () => {
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }

    let filename = selectedImage.substring(selectedImage.lastIndexOf("/") + 1);
    setUploading(true);
    try {
      await Storage.ref(filename).putFile(selectedImage);
      console.log("Upload successful!");
      // Reset modal and post content
      setModalVisible(false);
      setPostContent("");
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setUploading(false);
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

            <TextInput
              ref={inputRef}
              multiline
              style={styles.input}
              placeholder="What's on your mind?"
              value={postContent}
              onChangeText={setPostContent}
            />
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.postImage} />
            )}

            <View style={styles.photoBar}>
              <TouchableOpacity onPress={takePhoto}>
                <Camera width={40} height={40} />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage}>
                <Gallery width={40} height={40} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  postButtonTouchable: {
    backgroundColor: "#A61515",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  photoBar: {
    flexDirection: "row",
    margin: 8,
    gap: 8,
    alignItems: "center",
  },
  postImage: {
    width: width * 0.9,
    height: width * 0.9,
    alignSelf: "center",
    borderRadius: 10,
    resizeMode: "contain",
    margin: 6,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    color: "black",
    fontSize: 16,
  },
  postButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    fontSize: 18,
    padding: 10,
    textAlignVertical: "top",
  },
});

export default PostScreen;
