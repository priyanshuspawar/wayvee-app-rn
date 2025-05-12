import { Heart, MessageCircle, MapPin } from 'lucide-react-native';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Community = () => {
  // Dummy community posts data
  const posts = [
    {
      id: 1,
      user: 'FoodieRahul',
      location: 'Chandni Chowk, Delhi',
      content:
        'Just had the best paratha at Paranthe Wali Gali! 🥟 The aloo-stuffed one with mint chutney is a must-try! #DelhiStreetFood',
      likes: 245,
      comments: 38,
      image:
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      user: 'SweetToothPriya',
      location: 'Kolkata, West Bengal',
      content:
        'Rossogolla heaven at KC Das! 🍮 The syrup-soaked cottage cheese balls melt in your mouth. Bengali sweets are unmatched!',
      likes: 182,
      comments: 25,
      image:
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      user: 'RoyalFoodExplorer',
      location: 'Jaipur, Rajasthan',
      content:
        'Dal Baati Churma experience at Chokhi Dhani! 🍛 The authentic Rajasthani thali with ghee-laden baatis is pure indulgence!',
      likes: 167,
      comments: 19,
      image:
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      user: 'MumbaiMuncher',
      location: 'Juhu Beach, Mumbai',
      content:
        'Sunset with vada pav and cutting chai 🌅 Spicy potato patty in bun + milky tea = perfect beach snack! #MumbaiLife',
      likes: 328,
      comments: 45,
      image:
        'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      user: 'DosaKing',
      location: 'Chennai, Tamil Nadu',
      content:
        'Crispy masala dosa at Murugan Idli Shop! 🥥 Coconut chutney and sambar combo is life-changing. South Indian breakfast FTW!',
      likes: 294,
      comments: 32,
      image:
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="mb-6 font-urbanistBold text-3xl">Community</Text>

        {posts.map((post) => (
          <View key={post.id} className="mb-4 rounded-xl bg-muted-3 p-4">
            {/* User Info */}
            <View className="mb-3 flex-row items-center">
              <View className="bg-primary h-10 w-10 items-center justify-center rounded-full">
                <Text className="font-UrbanistBold text-white">
                  {post.user[0]}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="font-UrbanistSemiBold">{post.user}</Text>
                <View className="flex-row items-center">
                  <MapPin size={14} color="#666" />
                  <Text className="font-Urbanist ml-1 text-sm text-gray-600">
                    {post.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Post Content */}
            <Text className="font-Urbanist mb-3">{post.content}</Text>

            {/* Post Image */}
            <Image
              source={{ uri: post.image }}
              className="mb-3 h-48 w-full rounded-lg"
              resizeMode="cover"
            />

            {/* Interactions */}
            {/* <View className="flex-row items-center">
              <Pressable className="mr-6 flex-row items-center">
                <Heart size={20} color="#666" />
                <Text className="font-Urbanist ml-2">{post.likes}</Text>
              </Pressable>

              <Pressable className="flex-row items-center">
                <MessageCircle size={20} color="#666" />
                <Text className="font-Urbanist ml-2">{post.comments}</Text>
              </Pressable>
            </View> */}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Community;
