import { useEffect, useState } from "react";
import { Paper } from "@mantine/core";
import "./CurrentMonthStatsCards.css";

const API_URL = import.meta.env.VITE_API_URL as string;

type CurrentMonthStats = {
  transactionCount: number;
  categoryCount: number;
};

export function CurrentMonthStatsCards(): React.ReactElement | null {
  const [stats, setStats] = useState<CurrentMonthStats | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    fetch(`${API_URL}/api/users/${userId}/stats/current-month`)
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) {
    return null;
  }

  return (
    <div className="current-month-stats">
      <Paper withBorder radius="md" p="md" className="stats-card">
        <div className="stats-number">{stats.transactionCount}</div>
        <div className="stats-label">Transactions this month</div>
      </Paper>

      <Paper withBorder radius="md" p="md" className="stats-card">
        <div className="stats-number">{stats.categoryCount}</div>
        <div className="stats-label">Categories used</div>
      </Paper>
    </div>
  );
}
