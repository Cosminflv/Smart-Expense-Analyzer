import type { Transaction } from "../types/transactions.type";
import { API_URL } from "./config";


export async function getRecentTransactions(
  userId: number
): Promise<Transaction[]> {
  const res = await fetch(
    `${API_URL}/api/users/${userId}/transactions/recent`
  );

  if (!res.ok) {
    throw new Error("Failed to load recent transactions");
  }

  return res.json();
}
