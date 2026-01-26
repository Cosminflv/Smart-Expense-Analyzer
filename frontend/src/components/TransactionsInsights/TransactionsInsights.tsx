import type { Transaction } from "../../types/transactions.type";
import "./TransactionsInsights.css";

type Props = {
  transactions: Transaction[];
};

export function TransactionsInsights({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.amount < 0);

  const totalExpenses = expenses.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  const categories = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const biggestExpense =
    expenses.length > 0
      ? expenses.reduce((max, t) =>
          Math.abs(t.amount) > Math.abs(max.amount) ? t : max
        )
      : null;

  return (
    <div className="insights-panel">
      {/* Overview */}
      <div className="insight-card">
        <h4>Overview</h4>
        <p>{transactions.length} transactions</p>
        <p>Total spent: {totalExpenses.toFixed(2)} €</p>
      </div>

      {/* Top categories */}
      <div className="insight-card">
        <h4>Top categories</h4>
        {topCategories.length === 0 && <p>No expenses</p>}

        {topCategories.map(([cat, amt]) => (
          <div key={cat} className="insight-row">
            <span>{cat}</span>
            <span>{amt.toFixed(2)} €</span>
          </div>
        ))}
      </div>

      {/* Biggest expense */}
      {biggestExpense && (
        <div className="insight-card">
          <h4>Biggest expense</h4>
          <strong>{biggestExpense.description}</strong>
          <div>{Math.abs(biggestExpense.amount).toFixed(2)} €</div>
          <small>{biggestExpense.date}</small>
        </div>
      )}
    </div>
  );
}
