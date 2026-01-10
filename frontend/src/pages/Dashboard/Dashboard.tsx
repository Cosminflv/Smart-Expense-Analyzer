import {  MonthlySummary } from "../../components/MonthlySummary/MonthlySummary";
import {  TransactionsList } from "../../components/TransactionsList /TransactionsList ";
import { DailyTipCard } from "../../components/DailyTipCard/DailyTipCard";
import { DashboardHeader } from "../../components/DashboardHeader/DashboardHeader";
import { NavbarComponent } from "../../components/navbar/navbar";
import { ExpensesChart } from "../../components/ExpensesChart/ExpensesChart";
import { WelcomeCard } from "../../components/welcomeCard/welcomeCard";
import './Dashboard.css';


const Dashboard = () => {
  return (
    <div className="user-page-container">
      {/* Stânga */}
      <div className="user-navbar">
        <NavbarComponent />
      </div>

      {/* Mijloc */}
      <div className="user-main">
        <WelcomeCard />
        <MonthlySummary />
        <TransactionsList  />
      </div>

      {/* Dreapta */}
      <div className="user-right">
        <DashboardHeader />
        <ExpensesChart />
        <div className="right-bottom-message">
         <DailyTipCard/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
