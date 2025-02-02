import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Typography, TextField, Stack } from '@mui/material';

// Define a set of colors to be used in the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

/**
 * CostChart component
 * 
 * This component renders a pie chart showing costs by category for a specific year and month.
 * It allows users to input the desired year and month, then fetches and displays the relevant cost data.
 */

const CostChart = ({ db }) => {
  const [data, setData] = useState([]);//State to save the data for the chart
  const [year, setYear] = useState(null);//State for the year   
  const [month, setMonth] = useState(null);//State for the month

  /**
   * Fetches the cost data based on the selected year and month.
   * Triggered whenever the db,year or month values change.
   * 
   */
  useEffect(() => {
    const fetchData = async () => {
      if (db) {
        // Fetch total costs by category for the selected year and month
        const totals = await db.getCategoryTotalsByMonth(year, month);
         // Transform the data into a format suitable for the pie chart
        const chartData = Object.entries(totals).map(([category, sum]) => ({name: category,value: sum}));
        // Update the state with the fetched chart data
        setData(chartData);
      }
    };
    fetchData();
  },[db, year, month]);// Dependencies: db, year, and month

  return (
    <>
    {/* Display the title of the chart */}
      <Typography variant="h5" gutterBottom> Costs by Category </Typography>
        {/* Input fields for selecting the year and month */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField type="number" label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}/>
        <TextField type="number" label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}/>
      </Stack>
      {/* Pie chart to display cost distribution by category */}
      <PieChart width={700} height={400}>
        <Pie data={data} cx={320} cy={200} labelLine={false} label={({ name, percent }) =>`${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={140} fill="#8884d8" dataKey="value">
            {/* Render pie chart cells with different colors */}
          {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
        </Pie>
         {/* Tooltip to show data on hover */}
        <Tooltip />
        <Legend />
      </PieChart>
    </>
  );
};

export default CostChart;