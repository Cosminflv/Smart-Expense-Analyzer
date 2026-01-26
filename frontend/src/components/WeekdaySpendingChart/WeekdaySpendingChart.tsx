import { useEffect, useState } from "react";
import { Paper, Title, Text } from "@mantine/core";
import { BarChart } from "@mantine/charts";

import { getWeekdayTrends } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";
import { toISO } from "../../utils/date";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);

    setLoading(true);

    getWeekdayTrends(user.userId, toISO(start), toISO(end))
      .then((result) => {
        const mapped = result
          .sort(
            (a, b) =>
              ORDER.indexOf(a.dayOfWeek) -
              ORDER.indexOf(b.dayOfWeek)
          )
          .map((item) => ({
            day: LABELS[item.dayOfWeek] ?? item.dayOfWeek,
            amount: Number(item.totalAmount),
          }));

        setData(mapped);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper withBorder radius="md" p={{ base: "sm", sm: "md", md: "lg" }}>
      <Title order={4} mb="sm">
        Spending by weekday
      </Title>

      {loading ? (
        <Text size="sm" c="dimmed">
          Loading chart...
        </Text>
      ) : data.length === 0 ? (
        <Text size="sm" c="dimmed">
          No data available
        </Text>
      ) : (
        <BarChart
          h={220}
          data={data}
          dataKey="day"
          series={[{ name: "amount", color: "dark.6" }]}
          withLegend={false}
          yAxisProps={{
            tickFormatter: (v) => `${v} €`,
          }}
        />
      )}
    </Paper>
  );
}
