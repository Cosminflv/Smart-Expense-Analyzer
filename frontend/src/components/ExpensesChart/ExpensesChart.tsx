import { useEffect, useState } from "react";
import { Paper, Title, Select, Group, Text } from "@mantine/core";
import { BarChart } from "@mantine/charts";

import { getMonthlyExpenseSummary } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";

type MonthlyPoint = {
  month: string;
  amount: number;
};

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function ExpensesChart(): React.ReactElement {
  const [data, setData] = useState<MonthlyPoint[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
  });

 useEffect(() => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const userId = currentUser.userId; // 👈 asta rezolvă TS

  async function load() {
    setLoading(true);

    const months = Array.from({ length: 12 }, (_, i) => i);

    const results = await Promise.all(
      months.map(async (m) => {
        const start = new Date(year, m, 1);
        const end = new Date(year, m + 1, 0);

        const amount = await getMonthlyExpenseSummary(
          userId,              // ✅ TS 100% happy
          toISO(start),
          toISO(end)
        );

        return {
          month: start.toLocaleString("en", { month: "short" }),
          amount,
        };
      })
    );

    setData(results);
    setLoading(false);
  }

  load();
}, [year]);

  return (
    <Paper withBorder radius="md" p={{ base: "sm", sm: "md", md: "lg" }}>
      <Group justify="space-between" mb="md" wrap="wrap">
        <Title order={4}>Expenses per month</Title>

        <Select
          data={yearOptions}
          value={String(year)}
          onChange={(v) => v && setYear(Number(v))}
          size="sm"
          w={100}
        />
      </Group>

      {loading ? (
        <Text size="sm" c="dimmed">
          Loading chart...
        </Text>
      ) : (
        <BarChart
          h={220}
          data={data}
          dataKey="month"
          series={[{ name: "amount", color: "dark.6" }]}
          withLegend={false}
          withTooltip
          yAxisProps={{
            tickFormatter: (v) => `${v} €`,
          }}
        />
      )}
    </Paper>
  );
}
