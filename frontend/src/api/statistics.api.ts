import type { BalancePoint } from "../types/balancePoint.types";
import type { CategoryBreakdownItem } from "../types/categoryBreakdownItem.types";
import type { CurrentMonthStats } from "../types/currentMonthStats.types";
import type { HeatmapPoint } from "../types/heatmapPoint.type";
import type { SummaryResponse } from "../types/summaryResponse.types";
import type { WeekdayStat } from "../types/weekdayStat.type";
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


export async function getMonthlyExpenseSummary(
  userId: number,
  startDate: string,
  endDate: string
): Promise<number> {
  const res = await fetch(
    `${API_URL}/api/users/${userId}/profile/summary?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) {
    return 0;
  }

  const json = (await res.json()) as SummaryResponse;
  return Number(json.totalExpenses || 0);
}

export async function getMonthlySummary(
  userId: number,
  startDate: string,
  endDate: string
) {
  const res = await fetch(
    `${API_URL}/api/users/${userId}/profile/summary?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) {
    throw new Error("Failed to load monthly summary");
  }

  return res.json() as Promise<{
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
  }>;
}
export type MonthlyTopCategory = {
  month: string;
  category: string;
  totalAmount: number;
};

export async function getMonthlyTopCategories(
  userId: number,
  year: string
): Promise<MonthlyTopCategory[]> {
  const res = await fetch(
    `${API_URL}/api/statistics/${userId}/highlights/monthly-breakdown?year=${year}`
  );

  if (!res.ok) {
    throw new Error("Failed to load monthly top categories");
  }

  return res.json() as Promise<MonthlyTopCategory[]>;
}


export async function getMonthlyHeatmap(
  userId: number,
  startDate: string,
  endDate: string
): Promise<HeatmapPoint[]> {
  const res = await fetch(
    `${API_URL}/api/statistics/${userId}/trends/heatmap?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) {
    throw new Error("Failed to load heatmap data");
  }

  return res.json() as Promise<HeatmapPoint[]>;
}



export async function getWeekdayTrends(
  userId: number,
  startDate: string,
  endDate: string
): Promise<WeekdayStat[]> {
  const res = await fetch(
    `${API_URL}/api/statistics/${userId}/trends/weekdays?startDate=${startDate}&endDate=${endDate}`
  );

  if (!res.ok) {
    throw new Error("Failed to load weekday trends");
  }

  return res.json() as Promise<WeekdayStat[]>;
}
