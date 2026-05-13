import apiAIUrl from '~/api/urls/apiAIs';
import axios from 'axios';

// ===== CHAT AI =====
export async function apiChatAI(message) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${apiAIUrl}/chat`,
      {
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi chat AI:', error);
    throw error;
  }
}
