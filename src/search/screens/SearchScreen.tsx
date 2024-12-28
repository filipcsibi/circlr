import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import GestureRecognizer from "react-native-swipe-gestures";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export default function SearchScreen() {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: {
        name: "Sarah Wilson",
        avatar: "https://via.placeholder.com/32",
      },
      text: "This is absolutely stunning! 😍",
      timestamp: "2h ago",
    },
    {
      id: "2",
      user: {
        name: "Mike Johnson",
        avatar: "https://via.placeholder.com/32",
      },
      text: "Love the composition!",
      timestamp: "1h ago",
    },
  ]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "https://via.placeholder.com/32",
      },
      text: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <>
              {/* Post Image */}
              <Image
                source={{ uri: "https://via.placeholder.com/600" }}
                style={styles.postImage}
              />

              {/* Likes and Comments Count */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>♥️</Text>
                  <Text style={styles.statText}>2.5k</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💬</Text>
                  <Text style={styles.statText}>{comments.length}</Text>
                </View>
              </View>

              <Text style={styles.commentsHeader}>Comments</Text>
            </>
          )}
          contentContainerStyle={styles.contentContainer}
        />

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!newComment.trim()}
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 16,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  statText: {
    fontSize: 16,
    color: "#333",
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: "600",
    padding: 16,
    paddingBottom: 8,
  },
  commentContainer: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  timestamp: {
    color: "#666",
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
