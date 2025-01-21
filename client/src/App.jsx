import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import idb from '../idb';
import AddCostForm from '../components/AddCostForm';
import CostReport from '../components/CostReport';
import CostChart from '../components/CostChart';

const App = () => {
  useEffect(() => {
    const initDb = async () => {
      try {
        await idb.init();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initDb();
  }, []);


  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Cost Manager
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <AddCostForm db={idb} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <CostReport db={idb} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <CostChart db={idb} />
      </Paper>
    </Container>
  );
};

export default App;