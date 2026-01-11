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

  // 📅 date selector
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // default: last 12 months
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    setStartDate(toISO(start));
    setEndDate(toISO(end));
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    fetch(
      `${API_URL}/api/statistics/${userId}/breakdown?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((result) => {
        if (!Array.isArray(result)) {
          setData([]);
          setTotal(0);
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

        setData(mapped);
        setTotal(totalAmount);
      })
      .catch(() => {
        setData([]);
        setTotal(0);
      });
  }, [startDate, endDate]);

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="sm">
        Spending by category
      </Title>

      {/* DATE SELECTOR */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {data.length === 0 ? (
        <Text size="sm" c="dimmed">
          No data available for selected period
        </Text>
      ) : (
        <>
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
        </>
      )}
    </Paper>
  );
}
