import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);

  const fetchNumbers = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${id}`);
      setWindowPrevState(response.data.windowPrevState);
      setWindowCurrState(response.data.windowCurrState);
      setNumbers(response.data.numbers);
      setAvg(response.data.avg);
    } catch (error) {
      console.error('Error fetching numbers:', error.message);
    }
  };

  useEffect(() => {
    fetchNumbers('e'); // Example to fetch even numbers
  }, []);

  return (
    <div>
      <h1>Average Calculator</h1>
      <h2>Window Previous State</h2>
      <ul>
        {windowPrevState.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
      <h2>Window Current State</h2>
      <ul>
        {windowCurrState.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
      <h2>Numbers Fetched</h2>
      <ul>
        {numbers.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
      <h2>Average</h2>
      <p>{avg}</p>
    </div>
  );
};

export default App;
