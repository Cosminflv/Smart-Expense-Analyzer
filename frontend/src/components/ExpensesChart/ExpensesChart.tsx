import React from 'react';
import { Paper, Title, Tabs, Select, Group } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { FiChevronDown } from 'react-icons/fi';
import './ExpensesChart.css'; // We'll create this for custom styles

// 1. Mock data based on your image
const chartData = [
  { day: 'mon', hours: 0 },
  { day: 'tue', hours: 1.5 },
  { day: 'wed', hours: 2.5 },
  { day: 'thu', hours: 1 },
  { day: 'fri', hours: 4 },
  { day: 'sat', hours: 3 },
  { day: 'sun', hours: 2 },
];

// 2. Formatter to add "h" and use a comma (like in the image)
const formatValue = (value: number) => {
  if (value === null || value === undefined) return '';
  // Format to string, replace period with comma
  const formatted = value.toString().replace('.', ',');
  return `${formatted}h`;
};

export function ExpensesChart(): React.ReactElement {
  return (
    <Paper withBorder radius="md" p="xl" m="md" className="stats-container">
      
      {/* 3. Top Row: Title, Tabs, and Dropdown */}
      <Group justify="space-between" mb="lg">
        <div className="stats-header-left">
          <Title order={3}>Your statistics</Title>
          <Tabs defaultValue="hours" className="stats-tabs">
            <Tabs.List>
              <Tabs.Tab value="hours">Learning Hours</Tabs.Tab>
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

      {/* 4. The Line Chart */}
      <div style={{ height: 250 }}>
        <LineChart
          h={250}
          data={chartData}
          dataKey="day" // X-axis
          series={[{ name: 'hours', color: 'dark.6' }]} // Y-axis
          curveType="monotone" // Makes the line curved
          withDots // Shows the dots on data points
          withLegend={false} // Hides the "hours" legend
          
          // Set Y-axis to match image (0 to 5)
          yAxisProps={{
            domain: [0, 5],
            tickCount: 6,
          }}
          
          // Custom tooltip to match the floating label style
          tooltipProps={{
            content: ({ label, payload }) => (
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