import { useEffect, useState } from "react";
import "./DashboardHeader.css";

import { getCurrentMonthStats } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";

export function DashboardHeader(): React.ReactElement {
  const [stats, setStats] = useState<{
    transactionCount: number;
    categoryCount: number;
  } | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    getCurrentMonthStats(user.userId)
      .then(setStats)
      .catch(() => setStats(null));
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
