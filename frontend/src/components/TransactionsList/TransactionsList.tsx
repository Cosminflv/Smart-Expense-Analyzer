import React, { useEffect, useState } from "react";
import "./TransactionsList.css";

interface TransactionItemProps {
  id: string;
  iconUrl: string;
  title: string;
  category: string;
  amount: string;
}

function TransactionItem({
  iconUrl,
  title,
  category,
  amount,
}: TransactionItemProps): React.ReactElement {
  return (
    <div className="course-list-item">
      <div className="course-item-left">
        <div className="course-item-info">
          <span className="course-item-title">{title}</span>
          <span className="course-item-author">{category}</span>
        </div>
      </div>

      <div className="course-item-right">
        <span className="meta-text">{amount} €</span>
      </div>
    </div>
  );
}

export function TransactionsList(): React.ReactElement {
  const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/1/transactions/recent")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(
          data.map((t: any) => ({
            id: String(t.id),
            title: t.title,
            category: t.category,
            amount: t.amount.toFixed(2),
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div className="courses-section-container">
      <h2 className="section-heading">Recent transactions</h2>

      <div className="course-filters">
        <button className="filter-button active">All</button>
      </div>

      <div className="course-list">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} {...transaction} />
        ))}
      </div>
    </div>
  );
}
