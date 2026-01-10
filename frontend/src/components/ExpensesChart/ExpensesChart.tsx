import { useEffect, useState } from 'react';
import { Paper, Title } from '@mantine/core';
import { LineChart } from '@mantine/charts';

type ChartPoint = {
  category: string;
  amount: number;
};

const API_URL = import.meta.env.VITE_API_URL as string;

export function ExpensesChart(): React.ReactElement {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    // hardcodăm doar perioada TEMPORAR
    const startDate = '2025-01-01';
    const endDate = '2025-01-31';

    fetch(
      `${API_URL}/api/users/${user.userId}/breakdown?startDate=${startDate}&endDate=${endDate}`
    )
      .then((res) => res.json())
      .then((result) => {
        const mapped = result.map((item: any) => ({
          category: item.transactionCategory,
          amount: Number(item.totalAmount),
        }));

        setData(mapped);
      })
      .catch(() => setData([]));
  }, []);

  if (data.length === 0) {
    return (
      <Paper withBorder p="lg">
        <Title order={4}>No expense data</Title>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="lg" style={{ height: 350 }}>
      <Title order={3} mb="md">
        Expenses by category
      </Title>

      <LineChart
        data={data}
        dataKey="category"
        series={[{ name: 'amount', color: 'dark' }]}
        h={250}
        withDots
        yAxisProps={{
          tickFormatter: (v) => `${v} €`,
        }}
      />
    </Paper>
  );
}
