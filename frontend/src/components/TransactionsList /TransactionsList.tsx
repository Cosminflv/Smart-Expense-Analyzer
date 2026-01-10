import React from 'react';
import './TransactionsList .css';

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
        <img src={iconUrl} alt={title} className="course-item-icon" />
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
  const transactions: TransactionItemProps[] = [
    {
      id: '1',
      iconUrl: '/icons/food.png',
      title: 'McDonald’s',
      category: 'Food',
      amount: '12.50',
    },
    {
      id: '2',
      iconUrl: '/icons/bill.png',
      title: 'Electricity Bill',
      category: 'Utilities',
      amount: '45.00',
    },
    {
      id: '3',
      iconUrl: '/icons/shopping.png',
      title: 'Zara',
      category: 'Shopping',
      amount: '89.99',
    },
    {
      id: '4',
      iconUrl: '/icons/salary.png',
      title: 'Salary',
      category: 'Income',
      amount: '+2500.00',
    },
  ];

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
