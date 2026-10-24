import API from "../api/api";

export interface AIChatResponse {
  reply: string;
  foodItems?: {
    name: string;
    category: string;
    price: number;
  }[];
}

export const sendAIMessage = async (
  message: string
): Promise<AIChatResponse> => {
  const response = await API.post<AIChatResponse>("/ai/chat", {
    message,
  });

  return response.data;
};