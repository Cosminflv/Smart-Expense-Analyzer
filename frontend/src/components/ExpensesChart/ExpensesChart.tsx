import React, { useEffect, useState } from 'react';
import { Paper, Title } from '@mantine/core';
import { BarChart } from '@mantine/charts';

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
  const year = 2025; // sau new Date().getFullYear()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
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
            return { month: start.toLocaleString('en', { month: 'short' }), amount: 0 };
          }

          const json: SummaryResponse = await res.json();

          return {
            month: start.toLocaleString('en', { month: 'short' }),
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
      <Title order={3} mb="md">
        Expenses per month ({year})
      </Title>

      <BarChart
        h={260}
        data={data}
        dataKey="month"
        series={[
          {
            name: 'amount',
            color: 'dark.6',
          },
        ]}
        withLegend={false}
        withTooltip={false}
        yAxisProps={{
          tickFormatter: (v) => `${v} €`,
        }}
      />
    </Paper>
  );
}
