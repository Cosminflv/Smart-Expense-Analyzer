import { BalanceEvolutionChart } from "../../components/BalanceEvolutionChart/BalanceEvolutionChart";
import { CategoryDonutChart } from "../../components/CategoryDonutChart/CategoryDonutChart";
import { CurrentMonthStatsCards } from "../../components/CurrentMonthStatsCard/CurrentMonthStatsCards";
import { MonthlyTopCategoriesChart } from "../../components/MonthlyTopCategoriesChart/MonthlyTopCategoriesChart";
import { SpendingCalendar } from "../../components/SpendingCalendar/SpendingCalendar";
import { WeekdaySpendingChart } from "../../components/WeekdaySpendingChart/WeekdaySpendingChart";
import "./Analytics.css";

export default function Analytics() {
  return (
    <>
      <div className="user-main">
         <SpendingCalendar/> 
         <BalanceEvolutionChart />
        <MonthlyTopCategoriesChart />
      </div>

      <div className="user-right">
        <CurrentMonthStatsCards />
        <WeekdaySpendingChart />
        <CategoryDonutChart />
      </div>
    </>
  );
}
