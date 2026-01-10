import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../../api/dashboard";

import { NavbarComponent } from "../../components/navbar/navbar";
import { WelcomeCard } from "../../components/welcomeCard/welcomeCard";
import { MonthlySummary } from "../../components/MonthlySummary/MonthlySummary";

import { ExpensesChart } from "../../components/ExpensesChart/ExpensesChart";
import { DailyTipCard } from "../../components/DailyTipCard/DailyTipCard";
import { EmptyDashboardState } from "../../components/EmptyDashboardState/EmptyDashboardState";

import "./Dashboard.css";
import { TransactionsList } from "../../components/TransactionsList /TransactionsList";
import { GettingStartedCard } from "../../components/GettingStartedCard/GettingStartedCard";

const Dashboard = () => {
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    fetchDashboardSummary(user.userId)
      .then((data) => setHasData(data.hasData))
      .catch(() => setHasData(false));
  }, []);

  if (hasData === null) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="user-page-container">
      <div className="user-navbar">
        <NavbarComponent hasData={hasData} />
      </div>

      <div className="user-main">
        {hasData ? (
          <>
            <WelcomeCard />
            <MonthlySummary />
            <TransactionsList />
          </>
        ) : (
          <EmptyDashboardState />
        )}
      </div>

      <div className="user-right">
        {hasData ? (
          <>
            <ExpensesChart />
            <DailyTipCard />
          </>
        ) : (
          <GettingStartedCard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
