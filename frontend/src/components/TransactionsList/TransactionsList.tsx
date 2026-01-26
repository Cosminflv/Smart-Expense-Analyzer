import { useEffect, useState } from "react";
import "./TransactionsList.css";

import { getRecentTransactions } from "../../api/transactions.api";
import { getCurrentUser } from "../../utils/authStorage";
import type { Transaction } from "../../types/transactions.type";

function TransactionItem({
  description,
  category,
  amount,
}: Transaction): React.ReactElement {
  return (
    <div className="course-list-item">
      <div className="course-item-left">
        <div className="course-item-info">
          <span className="course-item-title">{description}</span>
          <span className="course-item-author">{category}</span>
        </div>
      </div>

      <div className="course-item-right">
        <span className="meta-text">{amount.toFixed(2)} €</span>
      </div>
    </div>
  );
}

export function TransactionsList(): React.ReactElement {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getRecentTransactions(user.userId)
      .then(setTransactions)
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="courses-section-container">
      <h2 className="section-heading">Recent transactions</h2>

      <div className="course-filters">
        <button className="filter-button active">All</button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="course-list">
        {transactions.map((t) => (
          <TransactionItem key={t.id} {...t} />
        ))}
      </div>
    </div>
  );
}
