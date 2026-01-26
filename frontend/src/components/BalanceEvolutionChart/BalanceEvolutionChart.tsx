import { useEffect, useState } from "react";
import { Paper, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";

const API_URL = import.meta.env.VITE_API_URL as string;

type BalancePoint = {
  date: string;
  balance: number;
};

export function BalanceEvolutionChart(): React.ReactElement {
  const [data, setData] = useState<BalancePoint[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    // ultimele 3 luni
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    fetch(
      `${API_URL}/api/statistics/${userId}/trends/balance?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((result) => {
        const mapped = result.map((item: any) => ({
          date: item.date,
          balance: Number(item.balance),
        }));
        setData(mapped);
      })
      .catch(() => setData([]));
  }, []);

  if (data.length === 0) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4}>Balance evolution</Title>
        <p>No data available</p>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="md">
        Balance evolution
      </Title>

      <LineChart
        h={260}
        data={data}
        dataKey="date"
        series={[
          {
            name: "balance",
            color: "dark.6",
          },
        ]}
        withDots={false}
        withLegend={false}
        yAxisProps={{
          tickFormatter: (v) => `${v} €`,
        }}
      />
    </Paper>
  );
}
