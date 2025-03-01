// components/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StarMap from './StarMap';

const Home = () => {
  const [constellations, setConstellations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/constellations');
        setConstellations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch constellations', err);
        setLoading(false);
      }
    };
    
    fetchConstellations();
  }, []);
  
  return (
    <div className="home">
      <h1>Welcome to Constellation Explorer</h1>
      <p>Discover the wonders of the night sky and learn about different constellations.</p>
      
      <div className="home-cta">
        <Link to="/constellations" className="btn btn-primary">
          Explore Constellations
        </Link>
      </div>
      
      {!loading && (
        <div className="star-map-section">
          <StarMap constellations={constellations} />
        </div>
      )}
      
      <div className="home-features">
        <div className="feature">
          <h3>Discover</h3>
          <p>Learn about different constellations and their stories.</p>
        </div>
        <div className="feature">
          <h3>Explore</h3>
          <p>Find out when and where to see constellations in the night sky.</p>
        </div>
        <div className="feature">
          <h3>Understand</h3>
          <p>Understand the science and mythology behind these celestial patterns.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;