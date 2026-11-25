import API from "../api/api";

export interface FoodSuggestionItem {
  name: string;
  category: string;
  price: number;
}

export interface AIChatResponse {
  reply: string;
  foodItems?: FoodSuggestionItem[];
}

export interface ReservationDetails {
  date: string;
  timeSlot: string;
  guests: number;
}

export interface PrepareReservationResponse {
  ready: boolean;
  details: {
    date: string | null;
    timeSlot: string | null;
    guests: number | null;
  };
  message: string;
  allowedTimeSlots?: string[];
  availability?: {
    available: boolean;
    reason?: string;
    table?: {
      tableNumber: number;
      capacity: number;
    };
  };
}

export interface ConfirmReservationResponse {
  message: string;
  reservation: {
    _id: string;
    date: string;
    timeSlot: string;
    guests: number;
    status: string;
    table?: {
      tableNumber: number;
      capacity: number;
    };
  };
}

const normalizeAIError = (error: unknown, fallback: string): Error => {
  const err = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;
  return new Error(message);
};

// General chatbot & food recommendations
export const sendAIMessage = async (
  message: string
): Promise<AIChatResponse> => {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    throw new Error("Please enter a message before sending.");
  }

  try {
    const response = await API.post<AIChatResponse>("/ai/chat", {
      message: cleanMessage,
    });
    return response.data;
  } catch (error) {
    throw normalizeAIError(error, "Unable to reach the AI assistant right now.");
  }
};

// Prepare reservation and check slot/table availability
export const prepareAIReservation = async (
  message: string
): Promise<PrepareReservationResponse> => {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    throw new Error("Please describe your preferred date, time slot, and guests.");
  }

  try {
    const response = await API.post<PrepareReservationResponse>(
      "/ai/reservation/prepare",
      { message: cleanMessage }
    );
    return response.data;
  } catch (error) {
    throw normalizeAIError(
      error,
      "Unable to prepare your reservation request right now."
    );
  }
};

// Create reservation only after explicit confirmation
export const confirmAIReservation = async (
  details: ReservationDetails
): Promise<ConfirmReservationResponse> => {
  try {
    const response = await API.post<ConfirmReservationResponse>(
      "/ai/reservation/confirm",
      {
        ...details,
        confirmed: true,
      }
    );
    return response.data;
  } catch (error) {
    throw normalizeAIError(error, "Unable to confirm your reservation.");
  }
};