import {
  Account,
  Home,
  HomeFill,
  Post,
  PostFill,
  Search,
  SearchFill,
} from "@/assets/svgs";
import FeedScreen from "@/src/feed/screens/FeedScreen";
import PostScreen, { PostScreenRef } from "@/src/post/screens/PostScreen";
import ProfileScreen from "@/src/profile/screens/ProfileScreen";
import SearchScreen from "@/src/search/screens/SearchScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const postScreenRef = useRef<PostScreenRef>(null);
  useEffect(() => {
    console.log("TabNavigator mounted");
  }, []);
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerTitle: "Circlr",
          headerTitleStyle: {
            color: "#A61515",
            fontSize: 24,
            fontWeight: "bold",
            fontFamily: "Courier",
          },
          headerTitleAlign: "left",
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="feedscreen"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HomeFill width={32} height={32} />
              ) : (
                <Home width={32} height={32} />
              ),
          }}
        />
        <Tab.Screen
          name="searchscreen"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <SearchFill width={32} height={32} />
              ) : (
                <Search width={32} height={32} />
              ),
          }}
        />
        <Tab.Screen
          name="postscreen"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <PostFill width={32} height={32} />
              ) : (
                <Post width={32} height={32} />
              ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => postScreenRef.current?.openPostModal()}
              />
            ),
          }}
        >
          {() => null}
        </Tab.Screen>
        <Tab.Screen
          name="profilescreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => <Account width={32} height={32} />,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
      <PostScreen ref={postScreenRef} />
    </>
  );
};
export default TabNavigator;
