import { useState } from 'react';
import './MiniAssistantChat.css';
import { TfiLightBulb } from 'react-icons/tfi';

const API_URL = import.meta.env.VITE_API_URL as string;

export function MiniAssistantChat(): React.ReactElement {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${API_URL}/api/chat/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const json = await res.json();
      setResponse(json.response);
    } catch {
      setResponse('Sorry, something went wrong.');
    } finally {
      setLoading(false);
      setMessage('');
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
        />
        <button onClick={sendMessage} disabled={loading}>
          Ask
        </button>
      </div>

      {response && (
        <div className="mini-chat-response">
          {response}
        </div>
      )}
    </div>
  );
}
