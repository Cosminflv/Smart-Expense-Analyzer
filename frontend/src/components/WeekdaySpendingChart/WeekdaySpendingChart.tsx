import { useEffect, useState } from "react";
import { Paper, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";

const API_URL = import.meta.env.VITE_API_URL as string;

type WeekdayPoint = {
  day: string;
  amount: number;
};

const ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const LABELS: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export function WeekdaySpendingChart(): React.ReactElement {
  const [data, setData] = useState<WeekdayPoint[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    // default: ultimele 3 luni
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    fetch(
      `${API_URL}/api/users/${userId}/trends/weekdays?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((result) => {
        const mapped = result
          .map((item: any) => ({
            day: item.dayOfWeek,
            amount: Number(item.totalAmount),
          }))
          // ordonăm corect zilele
          .sort(
            (a: any, b: any) =>
              ORDER.indexOf(a.day) - ORDER.indexOf(b.day)
          )
          // label scurt pt UI
          .map((item: any) => ({
            day: LABELS[item.day],
            amount: item.amount,
          }));

        setData(mapped);
      })
      .catch(() => setData([]));
  }, []);

  if (data.length === 0) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4}>Spending by weekday</Title>
        <p>No data available</p>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="md">
        Spending by weekday
      </Title>

      <BarChart
        h={240}
        data={data}
        dataKey="day"
        series={[
          {
            name: "amount",
            color: "dark.6",
          },
        ]}
        withLegend={false}
        yAxisProps={{
          tickFormatter: (v) => `${v} €`,
        }}
      />
    </Paper>
  );
}
