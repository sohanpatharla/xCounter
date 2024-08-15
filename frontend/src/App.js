import React, { useState } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Card, CardContent, Divider, Switch } from '@mui/material';
import Graph from './components/Graph';
import ExportOptions from './components/ExportOptions';
import './App.css';

function App() {
  const [folderPath, setFolderPath] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleBrowse = () => {
    // Logic to open file browser dialog and set folderPath
  };

  const handleCountLines = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/count-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching line count:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container className={darkMode ? 'dark-mode' : 'light-mode'} maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Code Line Counter Tool
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Analyze and visualize lines of code by file type and language.
      </Typography>
      <div className="input-section">
        <TextField
          fullWidth
          label="Enter folder path"
          variant="outlined"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        <Button variant="contained" color="primary" onClick={handleBrowse} style={{ marginRight: '8px' }}>
          Browse
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCountLines}>
          Count Lines
        </Button>
      </div>
      {loading && <CircularProgress />}
      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6">Total Lines of Code: {results.totalLines}</Typography>
            <Divider />
            <Typography variant="h6" style={{ marginTop: '16px' }}>Breakdown by File Type:</Typography>
            {Object.entries(results.fileCounts).map(([ext, count]) => (
              <Typography key={ext}>
                {ext}: {count} files, {results.lineCounts[ext] || 0} lines
              </Typography>
            ))}
            <Typography variant="h6" style={{ marginTop: '16px' }}>Breakdown by Language:</Typography>
            {Object.entries(results.languageCounts).map(([lang, { files, lines }]) => (
              <Typography key={lang}>
                {lang}: {files} files, {lines} lines
              </Typography>
            ))}
            <Graph data={results.graphData || { labels: [], values: [] }} />
            <ExportOptions results={results} />
          </CardContent>
        </Card>
      )}
      <div className="dark-mode-toggle">
        <Switch checked={darkMode} onChange={toggleDarkMode} />
        <Typography variant="body1">Dark Mode</Typography>
      </div>
    </Container>
  );
}

export default App;
