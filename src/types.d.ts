declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

// declare module '*.mp4'{
//   const value:import('expo-video').video
// }

interface User {
  id: string;
  firstname: string;
  lastname: string;
  picture: string;
  isAgent: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  lastMessageId: string | null;
  userUnreadCount: number;
  agentUnreadCount: number;
  updatedAt: string;
}
