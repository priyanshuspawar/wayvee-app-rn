// src/services/pusher.ts
import { Pusher } from '@pusher/pusher-websocket-react-native';

export enum PusherEvents {
  NEW_MESSAGE = 'new-message',
  MESSAGE_READ = 'message-read',
  TYPING = 'typing',
}

const pusherClient = Pusher.getInstance();

export async function initPusher(userId: string, token: string) {
  try {
    await pusherClient.init({
      apiKey: `${process.env.EXPO_PUBLIC_PUSHER_KEY}`,
      cluster: `${process.env.EXPO_PUBLIC_PUSHER_CLUSTER}`,
      authEndpoint: `${process.env.EXPO_PUBLIC_BACKEND_URL}/pusher/auth`,
      onAuthorizer: async (channelName, socketId) => {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/pusher/auth`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channelName,
            }),
          }
        );

        const data = await response.json();
        return data;
      },
    });

    await pusherClient.connect();
    await pusherClient.subscribe({
      channelName: `private-user-${userId}`,
      onEvent: (event) => {
        console.log(`Event received: ${event.eventName}`);
        // Handle events here or pass to a callback
      },
    });

    console.log('Pusher initialized successfully');
    return pusherClient;
  } catch (error) {
    console.error('Error initializing Pusher:', error);
    throw error;
  }
}

export default pusherClient;
