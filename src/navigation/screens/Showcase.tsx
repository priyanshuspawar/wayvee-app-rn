import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { Video } from 'expo-av';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

// Sample data for 8 random videos
const REELS_DATA = [
  {
    id: '1',
    user: {
      username: 'traveler_diaries',
      profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-young-woman-in-a-urban-environment-40658-large.mp4',
    description: 'Urban exploration vibes 🏙️ #citylife #urbanexplorer',
    music: 'Original Sound - traveler_diaries',
    likes: '245K',
    comments: '1.2K',
    shares: '34K',
    isFollowing: false,
  },
  {
    id: '2',
    user: {
      username: 'food_chronicles',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-hands-making-kimchi-at-home-cooking-korean-food-42263-large.mp4',
    description: 'Homemade kimchi recipe 🌶️ #koreanfood #cooking',
    music: 'In My Feelings - Drake',
    likes: '534K',
    comments: '8.9K',
    shares: '56K',
    isFollowing: true,
  },
  {
    id: '3',
    user: {
      username: 'fitness_matters',
      profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-with-a-professional-trainer-40235-large.mp4',
    description: 'Workout tips with my coach 💪 #fitness #training',
    music: 'Eye of the Tiger - Survivor',
    likes: '123K',
    comments: '3.4K',
    shares: '12K',
    isFollowing: false,
  },
  {
    id: '4',
    user: {
      username: 'dance_fever',
      profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-young-female-dancer-in-a-dancing-studio-40264-large.mp4',
    description: 'New choreography drop 🔥 #dance #studio',
    music: 'Savage - Megan Thee Stallion',
    likes: '876K',
    comments: '23K',
    shares: '145K',
    isFollowing: true,
  },
  {
    id: '5',
    user: {
      username: 'nature_walks',
      profilePic: 'https://randomuser.me/api/portraits/women/76.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    description: 'Spring has arrived! 🌸 #nature #spring',
    music: 'Here Comes the Sun - The Beatles',
    likes: '342K',
    comments: '4.5K',
    shares: '78K',
    isFollowing: false,
  },
  {
    id: '6',
    user: {
      username: 'pet_lover',
      profilePic: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-dog-catches-a-ball-in-the-snow-1241-large.mp4',
    description: 'Snow day with Max 🐶❄️ #doggo #snowday',
    music: 'Who Let The Dogs Out - Baha Men',
    likes: '756K',
    comments: '12.8K',
    shares: '98K',
    isFollowing: true,
  },
  {
    id: '7',
    user: {
      username: 'craft_ideas',
      profilePic: 'https://randomuser.me/api/portraits/women/90.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-woman-decorating-paper-crafts-with-glue-gun-9201-large.mp4',
    description: 'DIY decoration ideas for your room 🎨 #crafts #DIY',
    music: 'Crafty - Beastie Boys',
    likes: '156K',
    comments: '7.3K',
    shares: '29K',
    isFollowing: false,
  },
  {
    id: '8',
    user: {
      username: 'sunset_chaser',
      profilePic: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    videoUri:
      'https://assets.mixkit.co/videos/preview/mixkit-beautiful-sunset-seen-from-the-sea-4119-large.mp4',
    description: 'Magic hour at the beach ✨🌊 #sunset #beach',
    music: 'Sun Is Shining - Bob Marley',
    likes: '432K',
    comments: '5.7K',
    shares: '87K',
    isFollowing: true,
  },
];

const ReelItem = ({ item, isActive }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isActive]);

  const onLikePress = () => {
    setLiked(!liked);
  };

  const onSavePress = () => {
    setSaved(!saved);
  };

  // Render the camera icon at the top
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Reels</Text>
      <TouchableOpacity style={styles.cameraButton}>
        <Ionicons name="camera-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Render the reel actions (like, comment, share)
  // const renderActions = () => (
  //   <View style={styles.actionsContainer}>
  //     <TouchableOpacity style={styles.actionButton} onPress={onLikePress}>
  //       <AntDesign
  //         name={liked ? 'heart' : 'hearto'}
  //         size={28}
  //         color={liked ? '#FF4040' : 'white'}
  //       />
  //       <Text style={styles.actionText}>{item.likes}</Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity style={styles.actionButton}>
  //       <Ionicons name="chatbubble-outline" size={28} color="white" />
  //       <Text style={styles.actionText}>{item.comments}</Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity style={styles.actionButton}>
  //       <Ionicons name="paper-plane-outline" size={28} color="white" />
  //       <Text style={styles.actionText}>{item.shares}</Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity style={styles.actionButton} onPress={onSavePress}>
  //       <Ionicons
  //         name={saved ? 'bookmark' : 'bookmark-outline'}
  //         size={28}
  //         color="white"
  //       />
  //     </TouchableOpacity>

  //     <TouchableOpacity style={styles.actionButton}>
  //       <Ionicons name="ellipsis-vertical" size={22} color="white" />
  //     </TouchableOpacity>
  //   </View>
  // );

  // Render user info and description
  const renderUserInfo = () => (
    <View style={styles.userContainer}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.user.profilePic }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{item.user.username}</Text>
        {/* <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>
            {item.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity> */}
      </View>

      <Text style={styles.description}>{item.description}</Text>

      {/* <View style={styles.musicContainer}>
        <Ionicons name="musical-notes" size={16} color="white" />
        <Text style={styles.musicText}>{item.music}</Text>
      </View> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.videoContainer}
        onPress={() => setMuted(!muted)}>
        <Video
          ref={videoRef}
          source={{ uri: item.videoUri }}
          resizeMode="cover"
          isLooping
          isMuted={muted}
          style={styles.video}
        />
      </TouchableOpacity>

      {/* {renderActions()} */}
      {renderUserInfo()}

      {/* Mute indicator */}
      {muted && (
        <View style={styles.mutedContainer}>
          <Ionicons name="volume-mute" size={24} color="white" />
        </View>
      )}
    </View>
  );
};

const ReelsScreen = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveReelIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Showcase</Text>
        {/* <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={28} color="white" />
        </TouchableOpacity> */}
      </View>

      <FlatList
        ref={flatListRef}
        data={REELS_DATA}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={index === activeReelIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    width,
    height,
    backgroundColor: '#000',
  },
  videoContainer: {
    width,
    height,
    position: 'absolute',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 16,
  },
  headerText: {
    marginTop: 50,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    right: 10,
    bottom: 150,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 3,
  },
  userContainer: {
    position: 'absolute',
    bottom: 175,
    left: 0,
    right: 60,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  followButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  followText: {
    color: 'white',
    fontSize: 12,
  },
  description: {
    color: 'white',
    marginBottom: 10,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
  },
  mutedContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -25,
    marginTop: -25,
  },
});

export default ReelsScreen;
