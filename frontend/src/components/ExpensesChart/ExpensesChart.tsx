import React from 'react';
import { Paper, Title, Tabs, Select, Group } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { FiChevronDown } from 'react-icons/fi';
import './ExpensesChart.css';

// Mock data – cheltuieli pe zile
const chartData = [
  { day: 'Mon', amount: 120 },
  { day: 'Tue', amount: 80 },
  { day: 'Wed', amount: 200 },
  { day: 'Thu', amount: 60 },
  { day: 'Fri', amount: 150 },
  { day: 'Sat', amount: 90 },
  { day: 'Sun', amount: 40 },
];

// Formatter pentru €
const formatValue = (value: number) => {
  if (value === null || value === undefined) return '';
  return `${value} €`;
};

export function ExpensesChart(): React.ReactElement {
  return (
    <Paper withBorder radius="md" p="xl" m="md" className="stats-container">
      
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div className="stats-header-left">
          <Title order={3}>Expenses overview</Title>
          <Tabs defaultValue="expenses" className="stats-tabs">
            <Tabs.List>
              <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>

        <Select
          defaultValue="weekly"
          data={['Weekly', 'Monthly', 'Yearly']}
          rightSection={<FiChevronDown size={14} />}
          className="stats-select"
        />
      </Group>

      {/* Chart */}
      <div style={{ height: 250 }}>
        <LineChart
          h={250}
          data={chartData}
          dataKey="day"
          series={[{ name: 'amount', color: 'dark.6' }]}
          curveType="monotone"
          withDots
          withLegend={false}
          yAxisProps={{
            tickFormatter: (v) => `${v} €`,
          }}
          tooltipProps={{
            content: ({ payload }) => (
              <Paper shadow="md" radius="sm" p={5} withBorder>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {formatValue(payload?.[0]?.value as number)}
                </div>
              </Paper>
            ),
          }}
        />
      </div>
    </Paper>
  );
}
