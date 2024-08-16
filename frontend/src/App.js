import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, CircularProgress, 
  Card, CardContent, Divider, Switch, Snackbar, Alert, LinearProgress 
} from '@mui/material';
import Graph from './components/Graph';
import ExportOptions from './components/ExportOptions';
import './App.css';

function App() {
  const [folderPath, setFolderPath] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleBrowse = () => {
    // Implement file browser dialog logic here
  };

  const handleCountLines = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);

    // Simulating progress
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 1000);

    try {
      const response = await fetch('http://localhost:5000/count-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      });

      clearInterval(progressInterval); // Clear interval when request is done

      const data = await response.json();
      if (response.ok) {
        setResults(data);
        setProgress(100);
      } else {
        setError(data.error || 'An error occurred while counting lines.');
        setProgress(0);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setError('Error fetching line count: ' + error.message);
      setProgress(0);
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
        <Button variant="contained" color="secondary" onClick={handleCountLines} disabled={loading || !folderPath}>
          Count Lines
        </Button>
      </div>
      {loading && (
        <>
          <CircularProgress />
          <LinearProgress variant="determinate" value={progress} style={{ marginTop: '16px' }} />
          <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '8px' }}>
            {`${progress}% completed`}
          </Typography>
        </>
      )}
      {error && <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>}
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
