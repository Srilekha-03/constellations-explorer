import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ConstellationDetail = () => {
  const { id } = useParams();
  const [constellation, setConstellation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConstellation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/constellations/${id}`);
        setConstellation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch constellation details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchConstellation();
  }, [id]);

  if (loading) return <div className="loading">Loading constellation details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!constellation) return <div className="not-found">Constellation not found</div>;

  return (
    <div className="constellation-detail">
      <Link to="/constellations" className="back-link">← Back to Constellations</Link>
      
      <div className="detail-header">
        <h1>{constellation.name}</h1>
        <h3>{constellation.latin_name}</h3>
      </div>
      
      <div className="detail-content">
        <div className="detail-image">
          <img src={constellation.image_url} alt={constellation.name} />
        </div>
        
        <div className="detail-info">
          <div className="info-section">
            <h3>Description</h3>
            <p>{constellation.description}</p>
          </div>
          
          <div className="info-section">
            <h3>Best Viewing Season</h3>
            <p>{constellation.visible_season}</p>
          </div>
          
          <div className="info-section">
            <h3>Main Stars ({constellation.stars_count})</h3>
            <ul className="stars-list">
              {constellation.main_stars.map((star, index) => (
                <li key={index}>{star}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstellationDetail;