import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "../../api/dashboard";

import { NavbarComponent } from "../../components/navbar/navbar";
import { WelcomeCard } from "../../components/welcomeCard/welcomeCard";
import { MonthlySummary } from "../../components/MonthlySummary/MonthlySummary";

import { ExpensesChart } from "../../components/ExpensesChart/ExpensesChart";
import { MiniAssistantChat } from "../../components/MiniAssistantChat/MiniAssistantChat";
import { EmptyDashboardState } from "../../components/EmptyDashboardState/EmptyDashboardState";

import "./Dashboard.css";

import { GettingStartedCard } from "../../components/GettingStartedCard/GettingStartedCard";
import { TransactionsList } from "../../components/TransactionsList/TransactionsList";
import { DashboardHeader } from "../../components/DashboardHeader/DashboardHeader";

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
          <DashboardHeader/>
            <ExpensesChart />
            <MiniAssistantChat />
          </>
        ) : (
          <GettingStartedCard />
        )}
      </div>
    </>
  );
};

export default Dashboard;
