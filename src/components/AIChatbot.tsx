
import { useState } from "react";
import axios from "axios";
import "../styles/AIChatbot.css";
import {
  sendAIMessage,
  prepareAIReservation,
  confirmAIReservation,
  type ReservationDetails,
} from "../services/aiService";

type ChatMessage = {
  sender: "bot" | "user";
  text: string;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [pendingReservation, setPendingReservation] =
    useState<ReservationDetails | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello! Welcome to our restaurant. How can I help you today?",
    },
  ]);

  function addBotMessage(text: string) {
    setMessages((previous) => [
      ...previous,
      { sender: "bot", text },
    ]);
  }

  async function sendMessage(text = message) {
    const question = text.trim();

    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { sender: "user", text: question },
    ]);

    setMessage("");
    setLoading(true);

    try {
      if (bookingMode) {
        const data = await prepareAIReservation(question);

        if (!data.ready) {
          setPendingReservation(null);
          addBotMessage(data.message);
          return;
        }

        if (!data.availability?.available) {
          setPendingReservation(null);
          addBotMessage(
            data.message ||
              data.availability?.reason ||
              "Sorry, no suitable table is available for those details. Please try another time or guest count."
          );
          return;
        }

        const details: ReservationDetails = {
          date: data.details.date!,
          timeSlot: data.details.timeSlot!,
          guests: data.details.guests!,
        };

        setPendingReservation(details);

        addBotMessage(
          `${data.message}\n\nPlease review your booking:\nDate: ${details.date}\nTime: ${details.timeSlot}\nGuests: ${details.guests}\nTable: ${data.availability.table?.tableNumber ?? "Assigned on confirmation"}\n\nIf everything is correct, select Confirm Booking below.`
        );
      } else {
        const data = await sendAIMessage(question);
        addBotMessage(
          data.reply || "Sorry, I couldn't answer that."
        );
      }
    } catch (error: unknown) {
      console.error("Chatbot request failed:", error);

      let errorMessage =
        "Unable to connect to the chatbot server. Please check your connection and try again.";

      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        const serverReply = error.response?.data?.reply;

        if (typeof serverMessage === "string") {
          errorMessage = serverMessage;
        } else if (typeof serverReply === "string") {
          errorMessage = serverReply;
        }
      }

      addBotMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmBooking() {
    if (!pendingReservation || loading) return;

    setLoading(true);

    try {
      const result = await confirmAIReservation(pendingReservation);

      addBotMessage(
        `${result.message}\n\nReservation confirmed!\nDate: ${result.reservation.date}\nTime: ${result.reservation.timeSlot}\nGuests: ${result.reservation.guests}\nTable: ${result.reservation.table?.tableNumber ?? "Assigned"}`
      );

      setPendingReservation(null);
      setBookingMode(false);
    } catch (error: unknown) {
      console.error("Reservation confirmation failed:", error);

      let errorMessage =
        "We couldn't confirm your reservation. Please try again.";

      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;

        if (typeof serverMessage === "string") {
          errorMessage = serverMessage;
        }
      }

      addBotMessage(errorMessage);
      setPendingReservation(null);
    } finally {
      setLoading(false);
    }
  }

  function startBooking() {
    if (loading) return;

    setBookingMode(true);
    setPendingReservation(null);

    addBotMessage(
      "Let's book a table! Tell me your preferred date, time slot, and number of guests. For example: Book a table on 2026-11-01 at 18:00-19:00 for 2 guests."
    );
  }

  return (
    <div className="ai-chatbot">
      {isOpen && (
        <section
          className="ai-chat-window"
          aria-label="Restaurant assistant"
        >
          <header className="ai-chat-header">
            <div>
              <strong>Restaurant Assistant</strong>
              <small>
                {bookingMode
                  ? "AI table booking"
                  : "Here to help you"}
              </small>
            </div>

            <button
              type="button"
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div className="ai-chat-messages" aria-live="polite">
            {messages.map((item, index) => (
              <div
                key={`${item.sender}-${index}`}
                className={`ai-message ${item.sender}`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="ai-message bot">Typing...</div>
            )}
          </div>

          <div className="ai-quick-questions">
            <button
              type="button"
              disabled={loading}
              onClick={() => void sendMessage("How do I book a table?")}
            >
              How to book?
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => void sendMessage("What are the time slots?")}
            >
              Time slots
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                void sendMessage("How do I cancel my reservation?")
              }
            >
              Cancel booking
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={startBooking}
            >
              Book a table
            </button>
          </div>

          {bookingMode && pendingReservation && (
            <div className="ai-booking-confirm">
              <button
                type="button"
                disabled={loading}
                onClick={() => void handleConfirmBooking()}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setPendingReservation(null);
                  setBookingMode(false);
                  addBotMessage("Booking cancelled. How else can I help?");
                }}
              >
                Cancel
              </button>
            </div>
          )}

          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                bookingMode
                  ? "Enter date, time slot and guests..."
                  : "Ask your question..."
              }
              maxLength={500}
              aria-label="Message to restaurant assistant"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-chat-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}
