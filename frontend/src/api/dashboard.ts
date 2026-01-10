import { API_URL } from "./config";

export type DashboardSummary = {
  hasData: boolean;
};

export async function fetchDashboardSummary(
  userId: number
): Promise<DashboardSummary> {
  const res = await fetch(
    `${API_URL}/api/dashboard/summary?userId=${userId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load dashboard summary");
  }

  return res.json();
}
