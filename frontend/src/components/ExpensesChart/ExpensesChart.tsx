import { useEffect, useState } from "react";
import { Paper, Title, Select, Group } from "@mantine/core";
import { BarChart } from "@mantine/charts";

type MonthlyPoint = {
  month: string;
  amount: number;
};

type SummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
};

const API_URL = import.meta.env.VITE_API_URL as string;

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function ExpensesChart(): React.ReactElement {
  const [data, setData] = useState<MonthlyPoint[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // ani disponibili (poți ajusta ușor)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    async function load() {
      const months = Array.from({ length: 12 }, (_, i) => i);

      const results = await Promise.all(
        months.map(async (m) => {
          const start = new Date(year, m, 1);
          const end = new Date(year, m + 1, 0);

          const res = await fetch(
            `${API_URL}/api/users/${userId}/profile/summary?startDate=${toISO(
              start
            )}&endDate=${toISO(end)}`
          );

          if (!res.ok) {
            return {
              month: start.toLocaleString("en", { month: "short" }),
              amount: 0,
            };
          }

          const json: SummaryResponse = await res.json();

          return {
            month: start.toLocaleString("en", { month: "short" }),
            amount: Number(json.totalExpenses || 0),
          };
        })
      );

      setData(results);
    }

    load();
  }, [year]);

  return (
    <Paper withBorder radius="md" p="lg" className="stats-container">
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Title order={3}>Expenses per month</Title>

        <Select
          data={yearOptions}
          value={String(year)}
          onChange={(v) => v && setYear(Number(v))}
          size="sm"
          w={100}
        />
      </Group>

      <BarChart
        h={260}
        data={data}
        dataKey="month"
        series={[
          {
            name: "amount",
            color: "dark.6",
          },
        ]}
        withLegend={false}
        withTooltip
        yAxisProps={{
          tickFormatter: (v) => `${v} €`,
        }}
      />
    </Paper>
  );
}
