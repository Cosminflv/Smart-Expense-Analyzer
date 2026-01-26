import { useEffect, useState } from "react";
import { Paper, Title, Select, Group, Text } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import "./MonthlyTopCategoriesChart.css";

import {
  getMonthlyTopCategories,
  type MonthlyTopCategory,
} from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";

const MONTH_LABELS: Record<string, string> = {
  JANUARY: "Jan",
  FEBRUARY: "Feb",
  MARCH: "Mar",
  APRIL: "Apr",
  MAY: "May",
  JUNE: "Jun",
  JULY: "Jul",
  AUGUST: "Aug",
  SEPTEMBER: "Sep",
  OCTOBER: "Oct",
  NOVEMBER: "Nov",
  DECEMBER: "Dec",
};

export function MonthlyTopCategoriesChart(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState<string>(String(currentYear));
  const [data, setData] = useState<MonthlyTopCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    setLoading(true);

    getMonthlyTopCategories(user.userId, year)
      .then((result) => {
        const mapped = result.map((item) => ({
          ...item,
          month: MONTH_LABELS[item.month] ?? item.month,
        }));

        setData(mapped);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <Paper withBorder radius="md" p={{ base: "sm", sm: "md", md: "lg" }}>
      <Group justify="space-between" mb="md" wrap="wrap">
        <Title order={4}>Top spending category per month</Title>

        <Select
          value={year}
          onChange={(value) => value && setYear(value)}
          data={[
            String(currentYear - 2),
            String(currentYear - 1),
            String(currentYear),
            String(currentYear + 1),
          ]}
          size="xs"
          w={100}
        />
      </Group>

      {loading ? (
        <Text size="sm" c="dimmed">
          Loading...
        </Text>
      ) : data.length === 0 ? (
        <Text size="sm" c="dimmed">
          No data available
        </Text>
      ) : (
        <BarChart
          h={220}
          data={data}
          dataKey="month"
          series={[{ name: "totalAmount", color: "dark.6" }]}
          withLegend={false}
          yAxisProps={{
            tickFormatter: (v) => `${v} €`,
          }}
          tooltipProps={{
            content: ({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const p = payload[0].payload;

              return (
                <div className="monthly-tooltip">
                  <strong>{p.category}</strong>
                  <div>{p.totalAmount.toFixed(2)} €</div>
                </div>
              );
            },
          }}
        />
      )}
    </Paper>
  );
}
