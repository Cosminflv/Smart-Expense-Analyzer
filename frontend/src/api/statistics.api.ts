import { API_URL } from "./config";

export type BalancePoint = {
  date: string;
  balance: number;
};

export async function getBalanceTrends(
  userId: number,
  startDate: string,
  endDate: string
): Promise<BalancePoint[]> {
  const res = await fetch(
    `${API_URL}/api/statistics/${userId}/trends/balance?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) {
    throw new Error("Failed to load balance trends");
  }

  const result = await res.json();

  return result.map((item: any) => ({
    date: item.date,
    balance: Number(item.balance),
  }));
}
