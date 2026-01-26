import { useEffect, useState } from "react";
import { Paper, Title, Badge, ActionIcon, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import "./SpendingCalendar.css";

import { getMonthlyHeatmap } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";
import { toISO } from "../../utils/date";

export function SpendingCalendar(): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const userId = user.userId;

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

    setLoading(true);

    getMonthlyHeatmap(userId, toISO(start), toISO(end))
      .then((result) => {
        const map: Record<string, number> = {};
        result.forEach((item) => {
          map[item.date] = Number(item.totalSpent);
        });
        setData(map);
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // luni = 0

  const days: Array<{ day: number; amount: number | null } | null> = [];

  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISO(new Date(year, month, d));
    days.push({
      day: d,
      amount: data[iso] ?? null,
    });
  }

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  return (
    <Paper withBorder radius="md" p={{ base: "sm", sm: "md", md: "lg" }}>
      <div className="calendar-header-row">
        <ActionIcon variant="light" onClick={prevMonth}>
          <IconChevronLeft size={18} />
        </ActionIcon>

        <Title order={4}>
          {currentMonth.toLocaleString("en", {
            month: "long",
            year: "numeric",
          })}
        </Title>

        <ActionIcon variant="light" onClick={nextMonth}>
          <IconChevronRight size={18} />
        </ActionIcon>
      </div>

      {loading && (
        <Text size="sm" c="dimmed" mb="sm">
          Loading calendar...
        </Text>
      )}

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
