import { API_URL } from "./config";

export async function sendChatMessage(
  userId: number,
  message: string
): Promise<string> {
  const res = await fetch(`${API_URL}/api/chat/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Chat request failed");
  }

  const json = await res.json();
  return json.response as string;
}
