import { useEffect, useState } from "react";
import "./Transactions.css";

const API_URL = import.meta.env.VITE_API_URL as string;

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
};

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const storedUser = localStorage.getItem("currentUser");
  const userId = storedUser ? JSON.parse(storedUser).userId : null;

  useEffect(() => {
    // default: luna curentă
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    setStartDate(toISO(start));
    setEndDate(toISO(now));
  }, []);

  async function loadTransactions() {
    if (!userId || !startDate || !endDate) return;

    try {
      const res = await fetch(
        `${API_URL}/api/users/${userId}/transactions/history?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      setTransactions(data);
    } catch {
      setTransactions([]);
    }
  }

  return (
    <div className="transactions-page">
      <h2>Transactions</h2>

      {/* DATE FILTER */}
      <div className="date-filter">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={loadTransactions}>Apply</button>
      </div>

      {/* LIST */}
      <div className="transactions-list">
        {transactions.map((t) => (
          <div key={t.id} className="transaction-row">
            <div>
              <div className="description">{t.description}</div>
              <div className="meta">
                {t.category} • {t.date}
              </div>
            </div>

            <div className={`amount ${t.amount < 0 ? "expense" : "income"}`}>
              {t.amount.toFixed(2)} €
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
