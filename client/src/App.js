import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ConstellationList from './components/ConstellationList';
import ConstellationDetail from './components/ConstellationDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/constellations" element={<ConstellationList />} />
            <Route path="/constellations/:id" element={<ConstellationDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;