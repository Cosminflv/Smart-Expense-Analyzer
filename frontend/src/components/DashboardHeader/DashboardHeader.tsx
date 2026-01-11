import { useEffect, useState } from "react";
import "./DashboardHeader.css";

const API_URL = import.meta.env.VITE_API_URL as string;

type CurrentMonthStats = {
  transactionCount: number;
  categoryCount: number;
};

export function DashboardHeader(): React.ReactElement {
  const [stats, setStats] = useState<CurrentMonthStats | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    fetch(`${API_URL}/api/users/${userId}/stats/current-month`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch current month stats");
        }
        return res.json();
      })
      .then((data: CurrentMonthStats) => {
        setStats(data);
      })
      .catch(() => {
        setStats(null);
      });
  }, []);

  return (
    <div className="dashboard-header-container">
      <div className="header-top-row"></div>

      <div className="header-stats-row">
        <div className="stat-card">
          <span className="stat-number">
            {stats ? stats.transactionCount : "—"}
          </span>
          <span className="stat-label">
            Transactions
            <br />
            this month
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">
            {stats ? stats.categoryCount : "—"}
          </span>
          <span className="stat-label">
            Categories
            <br />
            used
          </span>
        </div>
      </div>
    </div>
  );
}
