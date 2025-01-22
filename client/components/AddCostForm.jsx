import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';


const AddCostForm = ({ db }) => {
  const [cost, setCost] = useState({
    sum: '',
    category: '',
    description: '',
    date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (db) {
      try {
        await db.addCost(cost);
        setCost({
          sum: '',
          category: '',
          description: '',
          date: ''
        });
      } catch (error) {
        console.error('Error adding cost:', error);
      }
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Add New Cost
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Sum"
            type="number"
            value={cost.sum}
            onChange={(e) => setCost({ ...cost, sum: Number(e.target.value) })}
            required
          />
          <FormControl required>
            <InputLabel>Category</InputLabel>
            <Select
              value={cost.category}
              onChange={(e) => setCost({ ...cost, category: e.target.value })}
              label="Category"
            >
              {db.categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={cost.description}
            onChange={(e) => setCost({ ...cost, description: e.target.value })}
            required
          />
          <TextField
            type="date"
            value={cost.date}
            onChange={(e) => setCost({ ...cost, date: e.target.value })}
            required
          />
          <Button variant="contained" type="submit">
            Add Cost
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default AddCostForm;