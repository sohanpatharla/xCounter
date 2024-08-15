import React from 'react';
import { Button } from '@mui/material';

const ExportOptions = ({ results }) => {
  const handleExport = (format) => {
    // Logic to export data in the selected format (e.g., CSV, JSON)
  };

  return (
    <div>
      <h3>Export Results</h3>
      <Button variant="contained" color="primary" onClick={() => handleExport('json')}>
        Export as JSON
      </Button>
      <Button variant="contained" color="secondary" onClick={() => handleExport('csv')}>
        Export as CSV
      </Button>
    </div>
  );
};

export default ExportOptions;
