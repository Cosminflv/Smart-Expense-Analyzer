import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./MiniAssistantChat.css";
import { TfiLightBulb } from "react-icons/tfi";

import { sendChatMessage } from "../../api/chat.api";
import { getCurrentUser } from "../../utils/authStorage";

export function MiniAssistantChat(): React.ReactElement {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const user = getCurrentUser();
    if (!user) return;

    setLoading(true);
    setResponse("");

    try {
      const reply = await sendChatMessage(user.userId, message);
      setResponse(reply);
    } catch {
      setResponse("Sorry, something went wrong.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  }

  return (
    <div className="mini-chat-container">
      <div className="mini-chat-header">
        <TfiLightBulb className="mini-chat-icon" />
        <span>Finance assistant</span>
      </div>

      <p className="mini-chat-hint">
        Ask me something about your spending 💬
      </p>

      <div className="mini-chat-input-row">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Why did I spend more last week?"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Handy shortcut
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {response && (
        <div className="mini-chat-response">
          {/* The AI response is now rendered as rich HTML */}
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}