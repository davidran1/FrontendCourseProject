import React, { useState } from 'react';
import {TextField,Button,FormControl,InputLabel,Select,MenuItem,Stack,Typography} from '@mui/material';

/**
 * AddCostForm component
 * 
 * This component renders a form to add a new cost item with fields for the sum, category, description, and date.
 */

const AddCostForm = ({ db }) => {
  // State hook to manage the form inputs (sum, category, description, and date)
  const [cost, setCost] = useState({sum: '', category: '', description: '', date: ''});//state to save the cost item
  
   /**
   * Handles the form submission, adds the new cost to the database, and resets the form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    if (db) {
      try {
        // Attempts to add the new cost to the database
        await db.addCost(cost);
        // Resets the form fields after successful submission
        setCost({sum: '', category: '', description: '', date: ''});//after submit the form , clear the form
      } catch (error) {
        console.error('Error adding cost:', error);
      }
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom> Add New Cost </Typography>
       {/* Form that handles submission */}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
           {/* Input field for the sum (amount) of the cost */}
          <TextField label="Sum" type="number" value={cost.sum} onChange={(e) => setCost({ ...cost, sum: Number(e.target.value) })}required/>
             {/* Dropdown for selecting a category */}
          <FormControl required>
            <InputLabel>Category</InputLabel>
            <Select value={cost.category} onChange={(e) => setCost({ ...cost, category: e.target.value })}label="Category">
               {/* generates menu items for categories from db */}
              {db.categories.map((category) => (<MenuItem key={category} value={category}> {category}</MenuItem> ))}
            </Select>
          </FormControl>
          {/* Input field for the description of the cost */}
          <TextField label="Description" value={cost.description} onChange={(e) => setCost({ ...cost, description: e.target.value })} required/>
            {/* Input field for the date of the cost */}
          <TextField label ="Date" type="date" value={cost.date} onChange={(e) => setCost({ ...cost, date: e.target.value })} required/>
            {/* Submit button to add the new cost */}
          <Button variant="contained" type="submit"> Add Cost</Button>
        </Stack>
      </form>
    </>
  );
};

export default AddCostForm;