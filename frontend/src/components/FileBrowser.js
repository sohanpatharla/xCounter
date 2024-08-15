import React from 'react';
import { Button } from '@mui/material';

const FileBrowser = ({ onBrowse }) => {
  return (
    <Button variant="outlined" onClick={onBrowse}>
      Browse Files
    </Button>
  );
};

export default FileBrowser;
