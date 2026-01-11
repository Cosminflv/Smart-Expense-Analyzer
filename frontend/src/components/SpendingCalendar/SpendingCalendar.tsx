import { useEffect, useState } from "react";
import { Paper, Title, Badge, ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import "./SpendingCalendar.css";

const API_URL = import.meta.env.VITE_API_URL as string;

export function SpendingCalendar(): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    const start = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );

    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    fetch(
      `${API_URL}/api/statistics/${userId}/trends/heatmap?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((result) => {
        const map: Record<string, number> = {};
        result.forEach((item: any) => {
          map[item.date] = Number(item.totalSpent);
        });
        setData(map);
      })
      .catch(() => setData({}));
  }, [currentMonth]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // luni = 0

  const days: any[] = [];

  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    days.push({
      day: d,
      amount: data[iso] ?? null,
    });
  }

  function prevMonth() {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  }

  return (
    <Paper withBorder radius="md" p="lg">
      {/* HEADER */}
      <div className="calendar-header-row">
        <ActionIcon variant="light" onClick={prevMonth}>
          <IconChevronLeft size={18} />
        </ActionIcon>

        <Title order={3}>
          {currentMonth.toLocaleString("en", {
            month: "long",
            year: "numeric",
          })}
        </Title>

        <ActionIcon variant="light" onClick={nextMonth}>
          <IconChevronRight size={18} />
        </ActionIcon>
      </div>

      {/* CALENDAR */}
      <div className="calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="calendar-header">
            {d}
          </div>
        ))}

        {days.map((d, idx) =>
          d ? (
            <div key={idx} className="calendar-cell">
              <div className="day-number">{d.day}</div>

              {d.amount && d.amount > 0 && (
                <Badge color="red" size="sm" variant="light">
                  {d.amount.toFixed(0)} €
                </Badge>
              )}
            </div>
          ) : (
            <div key={idx} />
          )
        )}
      </div>
    </Paper>
  );
}
