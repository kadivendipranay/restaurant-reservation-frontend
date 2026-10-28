
import { useEffect, useRef, useState } from "react";
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

const QUICK_ACTIONS = [
  {
    title: "How to book?",
    subtitle: "Step-by-step guide",
    icon: "📅",
    style: "booking",
    question: "How do I book a table?",
  },
  {
    title: "Time slots",
    subtitle: "View available slots",
    icon: "🕒",
    style: "time",
    question: "What are the available time slots?",
  },
  {
    title: "Cancel booking",
    subtitle: "Manage your booking",
    icon: "🗓️",
    style: "cancel",
    question: "How do I cancel my reservation?",
  },
  {
    title: "Book a table",
    subtitle: "Reserve your seat",
    icon: "🍽️",
    style: "table",
    question: "",
  },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [pendingReservation, setPendingReservation] =
    useState<ReservationDetails | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Welcome to ReserveDine! I'm your restaurant concierge. I can guide you through booking a table, checking time slots, and managing your reservations. How may I help you today?",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  function addBotMessage(text: string) {
    setMessages((previous) => [...previous, { sender: "bot", text }]);
  }

  function getErrorMessage(
    error: unknown,
    fallback: string,
    includeReply = false
  ) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;
      const serverReply = error.response?.data?.reply;

      if (typeof serverMessage === "string") return serverMessage;
      if (includeReply && typeof serverReply === "string") return serverReply;
    }

    return fallback;
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
          `${data.message}\n\nPlease review your booking:\nDate: ${details.date}\nTime: ${details.timeSlot}\nGuests: ${details.guests}\nTable: ${data.availability.table?.tableNumber ?? "Assigned on confirmation"}\n\nSelect Confirm Booking below when you're ready.`
        );
      } else {
        const data = await sendAIMessage(question);
        addBotMessage(data.reply || "Sorry, I couldn't answer that.");
      }
    } catch (error: unknown) {
      console.error("Chatbot request failed:", error);

      addBotMessage(
        getErrorMessage(
          error,
          "I couldn't connect to the restaurant assistant. Please check your connection and try again.",
          true
        )
      );
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

      addBotMessage(
        getErrorMessage(
          error,
          "We couldn't confirm your reservation. Please check your details and try again."
        )
      );

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
      "Let's find a table for you. Please enter your preferred date, time slot, and number of guests.\n\nExample: Book a table on 2026-11-01 at 18:00-19:00 for 2 guests."
    );

    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function cancelBookingMode() {
    if (loading) return;

    setPendingReservation(null);
    setBookingMode(false);
    addBotMessage("Booking cancelled. What else can I help you with?");
  }

  function handleQuickAction(question: string) {
    if (loading || bookingMode) return;

    if (!question) {
      startBooking();
      return;
    }

    void sendMessage(question);
  }

  return (
    <div className="ai-chatbot">
      {isOpen && (
        <section
          className={`ai-chat-window${bookingMode ? " booking-mode" : ""}`}
        >
          <header className="ai-chat-header">
            <div className="ai-brand-avatar" aria-hidden="true">
              🍽
            </div>

            <div className="ai-header-copy">
              <strong>ReserveDine Concierge</strong>
              <small>
                <span className="ai-status-dot" />
                {loading
                  ? "Preparing your response..."
                  : bookingMode
                    ? "Table booking assistance"
                    : "Here to help with your dining plans"}
              </small>
            </div>

            <button
              type="button"
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div
            className="ai-chat-messages"
            aria-live="polite"
            aria-relevant="additions text"
            role="log"
            aria-label="Conversation messages"
          >
            {messages.map((item, index) => (
              <div
                key={`${item.sender}-${index}`}
                className={`ai-message-row ${item.sender}`}
              >
                {item.sender === "bot" && (
                  <div className="ai-message-avatar" aria-hidden="true">
                    ✦
                  </div>
                )}

                <div className={`ai-message ${item.sender}`}>
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message-row bot">
                <div className="ai-message-avatar" aria-hidden="true">
                  ✦
                </div>

                <div
                  className="ai-typing"
                  role="status"
                  aria-label="Assistant is typing"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <section className="ai-quick-area" aria-label="Quick actions">
            <div className="ai-quick-heading">
              <span>QUICK ACTIONS</span>
              <span className="ai-heading-line" />
            </div>

            <div className="ai-quick-questions">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  className={`ai-action-card ${action.style}`}
                  disabled={loading || bookingMode}
                  onClick={() => handleQuickAction(action.question)}
                >
                  <span className="ai-action-icon" aria-hidden="true">
                    {action.icon}
                  </span>

                  <span className="ai-action-copy">
                    <strong>{action.title}</strong>
                    <small>{action.subtitle}</small>
                  </span>

                  <span className="ai-action-arrow" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </section>

          {bookingMode && pendingReservation && (
            <div className="ai-booking-confirm">
              <div className="ai-confirm-copy">
                <strong>Ready to confirm?</strong>
                <span>Review your reservation details above.</span>
              </div>

              <div className="ai-confirm-actions">
                <button
                  type="button"
                  className="ai-confirm-button"
                  disabled={loading}
                  onClick={() => void handleConfirmBooking()}
                >
                  {loading ? "Confirming..." : "Confirm booking"}
                </button>

                <button
                  type="button"
                  className="ai-cancel-button"
                  disabled={loading}
                  onClick={cancelBookingMode}
                >
                  Cancel
                </button>
              </div>
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
              ref={inputRef}
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                bookingMode
                  ? "Enter date, time slot and guests..."
                  : "Ask about your dining plans..."
              }
              maxLength={500}
              autoComplete="off"
              aria-label="Message to restaurant assistant"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-chat-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close assistant" : "Open restaurant assistant"}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}
