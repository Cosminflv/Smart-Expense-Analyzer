import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import "./MonthlySummary.css";

type Summary = {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
};

const API_URL = import.meta.env.VITE_API_URL as string;

export function MonthlySummary(): React.ReactElement | null {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    fetch(`${API_URL}/api/users/${user.userId}/profile/summary`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  if (!summary) return null;

  const income = summary.totalIncome || 1;

  const cards = [
    {
      title: "Income",
      subtitle: "Total income this month",
      value: `€ ${summary.totalIncome}`,
      progress: 100,
    },
    {
      title: "Expenses",
      subtitle: "Spent from income",
      value: `€ ${summary.totalExpenses}`,
      progress: Math.min(
        Math.round((summary.totalExpenses / income) * 100),
        100
      ),
    },
    {
      title: "Savings",
      subtitle: "Money saved this month",
      value: `€ ${summary.netSavings}`,
      progress:
        summary.netSavings > 0
          ? Math.min(
              Math.round((summary.netSavings / income) * 100),
              100
            )
          : 0,
      danger: summary.netSavings < 0,
    },
  ];

  const current = cards[index];

  return (
    <div className="monthly-summary-wrapper">
      {/* CARD */}
      <div className="monthly-summary-card">
        <div className="summary-left">
          <h3>{current.title}</h3>
          <p>{current.subtitle}</p>
          <span className="summary-value">{current.value}</span>
        </div>

        <div
          className={`progress-ring ${current.danger ? "danger" : ""}`}
          style={{ ["--progress" as any]: current.progress }}
        >
          <span>{current.progress}%</span>
        </div>
      </div>

      {/* SĂGEȚI ÎN AFARĂ */}
      <div className="carousel-arrows">
        <button
          onClick={() =>
            setIndex(index === 0 ? cards.length - 1 : index - 1)
          }
        >
          <FiArrowLeft />
        </button>
        <button
          onClick={() =>
            setIndex(index === cards.length - 1 ? 0 : index + 1)
          }
        >
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
