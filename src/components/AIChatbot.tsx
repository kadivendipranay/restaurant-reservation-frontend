
import { useState } from "react";
import "../styles/AIChatbot.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Welcome to our restaurant. How can I help you today?",
    },
  ]);

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
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.reply || data.message || "Request failed"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text: data.reply || "Sorry, I couldn't answer that.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot request failed:", error);

      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text: "Unable to connect to the chatbot server. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
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
              <small>Here to help you</small>
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
              onClick={() => sendMessage("How do I book a table?")}
            >
              How to book?
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => sendMessage("What are the time slots?")}
            >
              Time slots
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                sendMessage("How do I cancel my reservation?")
              }
            >
              Cancel booking
            </button>
          </div>

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
              placeholder="Ask your question..."
              maxLength={500}
              aria-label="Ask the restaurant assistant"
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
