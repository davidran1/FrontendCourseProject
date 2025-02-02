import React, { useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';
import idb from '../idb';
import AddCostForm from '../components/AddCostForm';
import CostReport from '../components/CostReport';
import CostChart from '../components/CostChart';

/**
 * App component
 * 
 * This component is the main container for the cost management application. It initializes the database,
 * renders the header, and includes the sections for adding costs, viewing the cost report, and displaying
 * the cost chart. Each section is wrapped in a Paper component for styling.
 * 
 */

const App = () => {
  // Initialize the IndexedDB when the component is mounted
  // The `useEffect` hook runs only once (on mount) to ensure the database is initialized
  useEffect(() => {idb.init().catch(console.error);
  }, []);// Empty dependency array ensures this effect runs only once after the initial render

  return (
    <Box sx={{ width: '100vw', bgcolor: '#f5f5f5' }}>
       {/* AppBar containing the title of the application */}
      <AppBar position="static">
        <Toolbar><Typography variant="h5">Cost Manager</Typography></Toolbar>
      </AppBar>
      {/* Main content container for the app */}
      <Container
        sx={{py: 3,display: 'flex',flexDirection: 'column',gap: 3,maxWidth: '800px !important',}}>
        {/* Section for adding a new cost item */}
        <Paper sx={{ p: 2 }}><AddCostForm db={idb} /></Paper>
        {/* Section for displaying the cost report */}
        <Paper sx={{ p: 2 }}><CostReport db={idb} /></Paper>
        {/* Section for displaying the cost chart */}
        <Paper sx={{ p: 2 }}><CostChart db={idb} /></Paper>
      </Container>
    </Box>
  );
};

export default App;
