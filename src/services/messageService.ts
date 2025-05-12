import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export class MessageService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  async getConversation(agentId: string) {
    const response = await axios.get(
      `${BASE_URL}/messages/conversation/${agentId}`,
      { headers: this.headers }
    );
    return response.data.data;
  }

  async sendMessage(receiverId: string, content: string) {
    const response = await axios.post(
      `${BASE_URL}/messages`,
      {
        receiverId,
        content,
      },
      { headers: this.headers }
    );
    return response.data.data;
  }

  async markAsRead(conversationId: string) {
    await axios.post(
      `${BASE_URL}/messages/read`,
      { conversationId },
      { headers: this.headers }
    );
  }

  async sendTypingStatus(receiverId: string, isTyping: boolean) {
    await axios.post(
      `${BASE_URL}/messages/typing`,
      { receiverId, isTyping },
      { headers: this.headers }
    );
  }
}
