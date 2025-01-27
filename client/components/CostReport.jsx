// components/CostReport.jsx
import React, { useState, useEffect } from "react";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,TextField,Stack,} from "@mui/material";

const CostReport = ({ db }) => {
  const [costs, setCosts] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    const fetchCosts = async () => {
      if (db) {
        const monthlyCosts = await db.getCostsByMonth(year, month);
        setCosts(monthlyCosts);
      }
    };
    fetchCosts();
  }, [db, year, month]);

  return (
    <>
      <Typography variant="h5" gutterBottom> Monthly Report </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField type="number" label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}/>
        <TextField type="number" label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}/>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costs.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell> {new Date(cost.date).toLocaleDateString()} </TableCell>
                <TableCell>{cost.category}</TableCell>
                <TableCell>{cost.description}</TableCell>
                <TableCell>{cost.sum}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CostReport;
