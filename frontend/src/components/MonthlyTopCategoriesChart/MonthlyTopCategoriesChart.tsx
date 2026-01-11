import { useEffect, useState } from "react";
import { Paper, Title, Select, Group } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import "./MonthlyTopCategoriesChart.css";

const API_URL = import.meta.env.VITE_API_URL as string;

type MonthlyTopCategory = {
  month: string;
  category: string;
  totalAmount: number;
};

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

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const { userId } = JSON.parse(storedUser);

    fetch(
      `${API_URL}/api/statistics/${userId}/highlights/monthly-breakdown?year=${year}`
    )
      .then((res) => res.json())
      .then((result) => {
        const mapped = result.map((item: any) => ({
          month: MONTH_LABELS[item.month] ?? item.month,
          category: item.category,
          totalAmount: Number(item.totalAmount),
        }));

        setData(mapped);
      })
      .catch(() => setData([]));
  }, [year]);

  return (
    <Paper withBorder radius="md" p="lg">
      {/* HEADER */}
      <Group justify="space-between" mb="md">
        <Title order={3}>Top spending category per month</Title>

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

      {/* EMPTY */}
      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <BarChart
          h={260}
          data={data}
          dataKey="month"
          series={[
            {
              name: "totalAmount",
              color: "dark.6",
            },
          ]}
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
