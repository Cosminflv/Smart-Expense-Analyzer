import type { BalancePoint } from "../types/balancePoint.types";
import type { CategoryBreakdownItem } from "../types/categoryBreakdownItem.types";
import type { CurrentMonthStats } from "../types/currentMonthStats.types";
import { API_URL } from "./config";

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

export async function getCategoryBreakdown(
  userId: number,
  startDate: string,
  endDate: string
) {
  const res = await fetch(
    `${API_URL}/api/statistics/${userId}/breakdown?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) {
    throw new Error("Failed to load category breakdown");
  }

  return res.json() as Promise<CategoryBreakdownItem[]>;
}

export async function getCurrentMonthStats(userId: number) {
  const res = await fetch(
    `${API_URL}/api/statistics/${userId}/stats/current-month`
  );

  if (!res.ok) {
    throw new Error("Failed to load current month stats");
  }

  return res.json() as Promise<CurrentMonthStats>;
}
