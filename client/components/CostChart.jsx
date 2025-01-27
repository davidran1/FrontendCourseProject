import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Typography, TextField, Stack } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CostChart = ({ db }) => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (db) {
        const totals = await db.getCategoryTotalsByMonth(year, month);
        const chartData = Object.entries(totals).map(([category, sum]) => ({name: category,value: sum}));
        setData(chartData);
      }
    };
    fetchData();
  }, [db, year, month]);

  return (
    <>
      <Typography variant="h5" gutterBottom> Costs by Category </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField type="number" label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}/>
        <TextField type="number" label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}/>
      </Stack>
      <PieChart width={700} height={400}>
        <Pie data={data} cx={320} cy={200} labelLine={false} label={({ name, percent }) =>`${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={140} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </>
  );
};

export default CostChart;