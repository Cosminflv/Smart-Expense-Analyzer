import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../../api/dashboard";

import { NavbarComponent } from "../../components/navbar/navbar";
import { WelcomeCard } from "../../components/welcomeCard/welcomeCard";
import { MonthlySummary } from "../../components/MonthlySummary/MonthlySummary";

import { ExpensesChart } from "../../components/ExpensesChart/ExpensesChart";
import { DailyTipCard } from "../../components/DailyTipCard/DailyTipCard";
import { EmptyDashboardState } from "../../components/EmptyDashboardState/EmptyDashboardState";

import "./Dashboard.css";

import { GettingStartedCard } from "../../components/GettingStartedCard/GettingStartedCard";
import { TransactionsList } from "../../components/TransactionsList/TransactionsList";

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
    <>

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
    </>
  );
};

export default Dashboard;
