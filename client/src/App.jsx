import React, { useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';
import idb from '../idb';
import AddCostForm from '../components/AddCostForm';
import CostReport from '../components/CostReport';
import CostChart from '../components/CostChart';

const App = () => {
  // Init the IndexedDB when the component render
  useEffect(() => {
    idb.init().catch(console.error);
  }, []);

  return (
    <Box sx={{ width: '100vw', bgcolor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Cost Manager</Typography>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          maxWidth: '800px !important',
        }}
      >
        <Paper elevation={2} sx={{ p: 2 }}>
          <AddCostForm db={idb} />
        </Paper>
        
        <Paper elevation={2} sx={{ p: 2 }}>
          <CostReport db={idb} />
        </Paper>
        
        <Paper elevation={2} sx={{ p: 2 }}>
          <CostChart db={idb} />
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
