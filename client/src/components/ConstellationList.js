import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ConstellationList = () => {
  const [constellations, setConstellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/constellations');
        setConstellations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch constellations');
        setLoading(false);
        console.error(err);
      }
    };

    fetchConstellations();
  }, []);

  if (loading) return <div className="loading">Loading constellations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="constellation-list">
      <h1>Constellations</h1>
      <div className="card-container">
        {constellations.map(constellation => (
          <div key={constellation.id} className="card">
            <img 
              src={constellation.image_url} 
              alt={constellation.name} 
              className="card-image"
            />
            <div className="card-content">
              <h2>{constellation.name}</h2>
              <p>Season: {constellation.visible_season}</p>
              <Link to={`/constellations/${constellation.id}`} className="btn btn-secondary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstellationList;