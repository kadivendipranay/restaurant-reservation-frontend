
import API from "../api/api";

export interface AIChatResponse {
  reply: string;
  foodItems?: {
    name: string;
    category: string;
    price: number;
  }[];
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

// Existing general chatbot
export const sendAIMessage = async (
  message: string
): Promise<AIChatResponse> => {
  const response = await API.post<AIChatResponse>(
    "/ai/chat",
    { message }
  );

  return response.data;
};

// Prepare reservation and check availability
export const prepareAIReservation = async (
  message: string
): Promise<PrepareReservationResponse> => {
  const response = await API.post<PrepareReservationResponse>(
    "/ai/reservation/prepare",
    { message }
  );

  return response.data;
};

// Create reservation only after explicit confirmation
export const confirmAIReservation = async (
  details: ReservationDetails
): Promise<ConfirmReservationResponse> => {
  const response = await API.post<ConfirmReservationResponse>(
    "/ai/reservation/confirm",
    {
      ...details,
      confirmed: true,
    }
  );

  return response.data;
};
