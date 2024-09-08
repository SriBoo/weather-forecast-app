// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitiesTable from './components/CitiesTable';
import WeatherPage from './components/WeatherPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CitiesTable />} />
          <Route path="/weather/:cityName" element={<WeatherPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
