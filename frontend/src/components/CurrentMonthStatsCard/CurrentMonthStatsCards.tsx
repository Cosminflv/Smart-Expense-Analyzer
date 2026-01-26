import { useEffect, useState } from "react";
import { Paper, Text } from "@mantine/core";
import "./CurrentMonthStatsCards.css";

import { getCurrentMonthStats } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";

export function CurrentMonthStatsCards(): React.ReactElement | null {
  const [stats, setStats] = useState<{
    transactionCount: number;
    categoryCount: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    getCurrentMonthStats(user.userId)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null; // sau skeleton dacă vrei
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="current-month-stats">
      <Paper withBorder radius="md" p="md" className="stats-card">
        <div className="stats-number">{stats.transactionCount}</div>
        <Text size="sm" c="dimmed">
          Transactions this month
        </Text>
      </Paper>

      <Paper withBorder radius="md" p="md" className="stats-card">
        <div className="stats-number">{stats.categoryCount}</div>
        <Text size="sm" c="dimmed">
          Categories used
        </Text>
      </Paper>
    </div>
  );
}
