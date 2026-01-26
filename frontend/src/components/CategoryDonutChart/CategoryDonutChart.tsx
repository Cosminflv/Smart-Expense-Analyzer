import { useEffect, useState } from "react";
import { Paper, Title, Text } from "@mantine/core";
import { DonutChart } from "@mantine/charts";

import { getCategoryBreakdown } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";

type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

const COLORS = [
  "#B2BEB5",
  "#7393B3",
  "#36454F",
  "#E5E4E2",
  "#d0b8ac",
  "#62929e",
];

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function CategoryDonutChart(): React.ReactElement {
  const [data, setData] = useState<DonutSlice[]>([]);
  const [total, setTotal] = useState(0);

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

    const user = getCurrentUser();
    if (!user) return;

    getCategoryBreakdown(user.userId, startDate, endDate)
      .then((result) => {
        const mapped: DonutSlice[] = result.map((item, index) => ({
          name: item.transactionCategory,
          value: Number(item.totalAmount),
          color: COLORS[index % COLORS.length],
        }));

        setData(mapped);
        setTotal(mapped.reduce((sum, item) => sum + item.value, 0));
      })
      .catch(() => {
        setData([]);
        setTotal(0);
      });
  }, [startDate, endDate]);

  return (
    <Paper withBorder radius="md" p={{ base: "sm", sm: "md", md: "lg" }}>
      <Title order={4} mb="sm">
        Spending by category
      </Title>

      {/* DATE SELECTOR */}
      <div className="date-range">
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
            size={200}
            thickness={24}
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
