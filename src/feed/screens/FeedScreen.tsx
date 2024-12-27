import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import PostCard from "../components/PostCard";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { DataBase } from "@/FirebaseConfig";

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const POSTS_PER_PAGE = 4;

  const fetchPosts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      let postsQuery;
      if (isLoadMore && lastVisible) {
        postsQuery = query(
          collection(DataBase, "posts"),
          orderBy("postTime", "desc"),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        );
      } else {
        postsQuery = query(
          collection(DataBase, "posts"),
          orderBy("postTime", "desc"),
          limit(POSTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(postsQuery);

      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setPosts((prevPosts) =>
        isLoadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLastVisible(null);
    await fetchPosts(false);
  };

  const handleLoadMore = async () => {
    if (!loadingMore && lastVisible) {
      await fetchPosts(true);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard {...item} />}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" color="#666" /> : null
        }
      />
    </View>
  );
};

export default FeedScreen;
