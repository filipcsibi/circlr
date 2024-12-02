import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import PostCard from "../components/PostCard";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { DataBase } from "@/FirebaseConfig";

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPosts = async () => {
    try {
      const q = query(
        collection(DataBase, "posts"),
        orderBy("postTime", "desc")
      );
      const querySnapshot = await getDocs(q);

      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(fetchedPosts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        onRefresh={fetchPosts}
        refreshing={loading}
        data={posts}
        renderItem={({ item }) => <PostCard {...item} />}
        keyExtractor={(item) => item.id}
      ></FlatList>
    </View>
  );
};

export default FeedScreen;
