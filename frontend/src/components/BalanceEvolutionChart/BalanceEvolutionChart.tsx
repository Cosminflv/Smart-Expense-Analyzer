import { useEffect, useState } from "react";
import { Paper, Title, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";

import { getBalanceTrends, type BalancePoint } from "../../api/statistics.api";
import { getCurrentUser } from "../../utils/authStorage";

export function BalanceEvolutionChart(): React.ReactElement {
  const [data, setData] = useState<BalancePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    getBalanceTrends(user.userId, startDate, endDate)
      .then(setData)
      .catch(() => setError("Could not load balance evolution"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4}>Balance evolution</Title>
        <Text>Loading...</Text>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4}>Balance evolution</Title>
        <Text color="red">{error}</Text>
      </Paper>
    );
  }

  if (data.length === 0) {
    return (
      <Paper withBorder radius="md" p="lg">
        <Title order={4}>Balance evolution</Title>
        <Text>No data available</Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p={{ base: "sm", sm: "md", md: "lg" }}>
      <Title order={4} mb="sm">
        Balance evolution
      </Title>

      <LineChart
        h={220}
        mih={180}
        data={data}
        dataKey="date"
        series={[{ name: "balance", color: "dark.6" }]}
        withDots={false}
        withLegend={false}
        yAxisProps={{
          tickFormatter: (v) => `${v} €`,
        }}
      />
    </Paper>
  );
}
