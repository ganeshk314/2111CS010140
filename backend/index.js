const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10; // Configure window size as needed

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store for numbers
let windowNumbers = [];

// Replace with your actual token
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIzODc1MjQzLCJpYXQiOjE3MjM4NzQ5NDMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjcwNGU5YzFkLWJmZTUtNDJiNy04NzY4LWVjYTk5NjM2ZGNkNiIsInN1YiI6IjIxMTFjczAxMDE0MEBtYWxsYXJlZGR5dW5pdmVyc2l0eS5hYy5pbiJ9LCJjb21wYW55TmFtZSI6Ik1hbGxhIFJlZGR5IFVuaXZlcnNpdHkiLCJjbGllbnRJRCI6IjcwNGU5YzFkLWJmZTUtNDJiNy04NzY4LWVjYTk5NjM2ZGNkNiIsImNsaWVudFNlY3JldCI6IkhmVk1PdkVTUXJSYUxaT1QiLCJvd25lck5hbWUiOiJLdXRpa3VwcGFsYSBHYW5lc2giLCJvd25lckVtYWlsIjoiMjExMWNzMDEwMTQwQG1hbGxhcmVkZHl1bml2ZXJzaXR5LmFjLmluIiwicm9sbE5vIjoiMjExMUNTMDEwMTQwIn0.wNFb7XWtWAzZTwGcErFECUwNLSifIZAytPO_hogQUJk';

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:numberid', async (req, res) => {
  try {
    const { numberid } = req.params;
    const urls = {
      p: 'http://20.244.56.144/test/primes',
      f: 'http://20.244.56.144/test/fibo',
      e: 'http://20.244.56.144/test/even',
      r: 'http://20.244.56.144/test/rand'
    };

    if (!urls[numberid]) {
      return res.status(400).json({ error: 'Invalid numberid' });
    }

    const response = await axios.get(urls[numberid], {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      timeout: 500
    });

    const newNumbers = response.data.numbers;

    // Filter out unique numbers and sort them
    const uniqueNewNumbers = Array.from(new Set(newNumbers)).sort((a, b) => a - b);

    // Update windowNumbers
    windowNumbers = [...new Set([...windowNumbers, ...uniqueNewNumbers])].slice(-WINDOW_SIZE);

    // Calculate average
    const average = calculateAverage(windowNumbers);

    res.json({
      windowPrevState: windowNumbers.slice(0, -uniqueNewNumbers.length),
      windowCurrState: windowNumbers,
      numbers: uniqueNewNumbers,
      avg: average
    });
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
