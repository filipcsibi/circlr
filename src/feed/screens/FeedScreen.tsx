import React from "react";
import { View, FlatList } from "react-native";
import PostCard from "../components/PostCard";

export const Posts = [
  {
    id: "1",
    userName: "john_doe",
    userDescription: "This is a post caption.",
    userImage: "https://picsum.photos/200/300",
    postImage: "https://picsum.photos/200/300",
    postTime: "2 hours ago",
    userTag: "@johndoe",
    likes: "5",
    liked: false,
    comments: "2",
  },
  {
    id: "2",
    userName: "jane_smith",
    userDescription: "Exploring new places!",
    userImage: "https://picsum.photos/200/301",
    postImage: "https://picsum.photos/200/301",
    postTime: "2 hours ago",
    userTag: "@janesmith",
    likes: "12",
    liked: true,
    comments: "4",
  },
  {
    id: "3",
    userName: "mark_lee",
    userDescription: "Loving this weather!",
    userImage: "https://picsum.photos/200/302",
    postImage: "https://picsum.photos/200/302",
    postTime: "2 hours ago",
    userTag: "@marklee",
    likes: "9",
    liked: false,
    comments: "3",
  },
  {
    id: "4",
    userName: "sarah_connor",
    userDescription: "Throwback to an amazing day.",
    userImage: "https://picsum.photos/200/303",
    postImage: "https://picsum.photos/200/303",
    postTime: "2 hours ago",
    userTag: "@sarahconnor",
    likes: "22",
    liked: true,
    comments: "5",
  },
  {
    id: "5",
    userName: "alex_jones",
    userDescription: "Captured this beautiful moment.",
    userImage: "https://picsum.photos/200/304",
    postImage: "https://picsum.photos/200/304",
    postTime: "2 hours ago",
    userTag: "@alexjones",
    likes: "16",
    liked: false,
    comments: "7",
  },
  {
    id: "6",
    userName: "emma_watson",
    userDescription: "Nothing better than a sunset.",
    userImage: "https://picsum.photos/200/305",
    postImage: "https://picsum.photos/200/305",
    postTime: "2 hours ago",
    userTag: "@emmawatson",
    likes: "30",
    liked: true,
    comments: "10",
  },
];
const FeedScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={Posts}
        renderItem={({ item }) => <PostCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  );
};

export default FeedScreen;
