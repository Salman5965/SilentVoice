import { apiService } from "./api";

class MessagingService {
  // Get all conversations for the current user with pagination
  async getConversations(page = 1, limit = 20) {
    try {
      const response = await apiService.get(
        `/chat/conversations?page=${page}&limit=${limit}`
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to fetch conversations");
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      return {
        conversations: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  }

  // Create or get existing conversation with a user
  async createConversation(participantId) {
    try {
      const response = await apiService.post("/chat/conversations", {
        participantId,
      });
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to create conversation");
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await apiService.get(
        `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to fetch messages");
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      return {
        messages: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  }

  // Send a message in a conversation
  async sendMessage(conversationId, content, type = "text") {
    try {
      const response = await apiService.post(
        `/chat/conversations/${conversationId}/messages`,
        { content, type }
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to send message");
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  // Edit a message
  async editMessage(messageId, content) {
    try {
      const response = await apiService.patch(`/chat/messages/${messageId}`, {
        content,
      });
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to edit message");
    } catch (error) {
      console.error("Failed to edit message:", error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId) {
    try {
      const response = await apiService.delete(`/chat/messages/${messageId}`);
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to delete message");
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  }

  // Delete a conversation
  async deleteConversation(conversationId) {
    try {
      const response = await apiService.delete(
        `/chat/conversations/${conversationId}`
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to delete conversation");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  }

  // Mark conversation as read
  async markAsRead(conversationId) {
    try {
      const response = await apiService.patch(
        `/chat/conversations/${conversationId}/read`
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to mark as read");
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
      return { status: "error", message: error.message };
    }
  }

  // Archive conversation
  async archiveConversation(conversationId) {
    try {
      const response = await apiService.patch(
        `/chat/conversations/${conversationId}/archive`
      );
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to archive conversation");
    } catch (error) {
      console.error("Failed to archive conversation:", error);
      throw error;
    }
  }

  // Search messages
  async searchMessages(query, conversationId = null) {
    try {
      const params = new URLSearchParams({ q: query });
      if (conversationId) params.append("conversationId", conversationId);
      const response = await apiService.get(`/chat/messages/search?${params}`);
      if (response.status === "success") return response.data;
      throw new Error(response.message || "Failed to search messages");
    } catch (error) {
      console.error("Failed to search messages:", error);
      return { messages: [] };
    }
  }

  // Search users to start new conversations
  async searchUsers(query, limit = 10) {
    try {
      const response = await apiService.get(
        `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      if (response.status === "success") return response.data.users || [];
      throw new Error(response.message || "Failed to search users");
    } catch (error) {
      console.error("Failed to search users:", error);
      return [];
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiService.get(`/users/${userId}`);
      if (response.status === "success") return response.data.user || response.data;
      throw new Error(response.message || "Failed to get user");
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await apiService.get("/chat/unread-count");
      if (response.status === "success") return response.data.unreadCount || 0;
      return 0;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  }
}

export const messagingService = new MessagingService();
export default messagingService;
