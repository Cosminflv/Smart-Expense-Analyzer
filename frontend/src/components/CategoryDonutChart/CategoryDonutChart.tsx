import { useEffect, useState } from "react";
import { Paper, Title, Text } from "@mantine/core";
import { DonutChart } from "@mantine/charts";

const API_URL = import.meta.env.VITE_API_URL as string;

type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

const COLORS = [
  "#1c7ed6",
  "#37b24d",
  "#f59f00",
  "#e03131",
  "#7048e8",
  "#0ca678",
];

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function CategoryDonutChart(): React.ReactElement {
  const [data, setData] = useState<DonutSlice[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    // 🔥 last 12 months (dynamic, no hardcoding)
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    const startDate = toISO(start);
    const endDate = toISO(end);

    fetch(
      `${API_URL}/api/statistics/${userId}/breakdown?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((result) => {
        if (!Array.isArray(result)) {
          setData([]);
          return;
        }

        const mapped: DonutSlice[] = result.map(
          (item: any, index: number) => ({
            name: item.transactionCategory,
            value: Number(item.totalAmount),
            color: COLORS[index % COLORS.length],
          })
        );

        const totalAmount = mapped.reduce(
          (sum, item) => sum + item.value,
          0
        );

        setTotal(totalAmount);
        setData(mapped);
      })
      .catch(() => {
        setData([]);
        setTotal(0);
      });
  }, []);

  if (data.length === 0) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4}>Spending by category</Title>
        <Text size="sm" c="dimmed">
          No data available
        </Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="sm">
        Spending by category
      </Title>

      <DonutChart
        data={data}
        size={220}
        thickness={28}
        withTooltip
      />

      <Text ta="center" mt="md" fw={600}>
        Total spent
      </Text>
      <Text ta="center" size="lg">
        {total.toFixed(2)} €
      </Text>
    </Paper>
  );
}
