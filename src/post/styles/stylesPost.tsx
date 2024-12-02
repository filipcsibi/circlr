import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  uploadingContainer: {
    width: "100%",
    height: width * 0.1,
    marginVertical: 100,
    justifyContent: "center",
    alignItems: "center",
  },
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
