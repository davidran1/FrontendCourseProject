// components/CostReport.jsx
import React, { useState, useEffect } from "react";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,TextField,Stack,} from "@mui/material";

/**
 * CostReport component
 * 
 * This component displays a monthly report of cost items in a table format. Users can select the year and month
 * to view the associated cost data for that period.
 */

const CostReport = ({ db }) => {
  const [costs, setCosts] = useState([]);//State for cost items table
  const [year, setYear] = useState(null);//State for the year
  const [month, setMonth] = useState(null);//State for the month

   /**
   * Fetches the cost data for the selected year and month.
   * Triggered whenever the db, year or month values change.
   */
  useEffect(() => {
    const fetchCosts = async () => {
      if (db) {
        // Fetches the costs for the selected month and year from the database
        const monthlyCosts = await db.getCostsByMonth(year, month);
         // Updates the state with the fetched cost data
        setCosts(monthlyCosts);
      }
    };
    fetchCosts();
  }, [db, year, month]);// Dependencies: db, year, and month

  return (
    <>
     {/* Display the title of the report */}
      <Typography variant="h5" gutterBottom> Monthly Report </Typography>
       {/* Input fields for selecting the year and month */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField type="number" label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}/>
        <TextField type="number" label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}/>
      </Stack>
       {/* Table displaying the costs for the selected year and month */}
      <TableContainer>
        <Table>
             {/* Table header with column titles */}
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {/* run over the costs array and renders a row for each cost item */}
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
