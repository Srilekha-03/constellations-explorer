import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StarMap from './StarMap';

const ConstellationDetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [constellation, setConstellation] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchConstellation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/constellations/${id}`);
        setConstellation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load constellation data');
        setLoading(false);
      }
    };
    
    fetchConstellation();
  }, [id]);
  
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!currentUser) return;
      
      try {
        const response = await axios.get('http://localhost:5000/api/favorites');
        const favoriteIds = response.data.map(fav => fav.id);
        setIsFavorite(favoriteIds.includes(parseInt(id)));
      } catch (err) {
        console.error('Error checking favorites:', err);
      }
    };
    
    checkIfFavorite();
  }, [currentUser, id]);
  
  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert('Please login to add favorites');
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/api/favorites/${id}`);
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post('http://localhost:5000/api/favorites', { constellation_id: id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };
  
  if (loading) return <div className="detail-container loading">Loading constellation details...</div>;
  
  if (error) return <div className="detail-container error">{error}</div>;
  
  if (!constellation) return <div className="detail-container not-found">Constellation not found</div>;
  
  return (
    <div className="container">
      <div className="detail-container">
        <div className="constellation-header">
          <h2>{constellation.name}</h2>
          {currentUser && (
            <button 
              onClick={handleToggleFavorite}
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            >
              {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
            </button>
          )}
        </div>
        
        <div className="detail-grid">
          <div className="detail-image">
            <img src={constellation.image_url} alt={constellation.name} />
            
            {/* Star Map Visualization */}
            <div className="star-map-section">
              <StarMap constellation={constellation} />
            </div>
          </div>
          
          <div className="detail-info">
            <p><strong>Latin Name:</strong> {constellation.latin_name}</p>
            <p><strong>Best Viewing Season:</strong> {constellation.visible_season}</p>
            <p><strong>Number of Main Stars:</strong> {constellation.stars_count}</p>
            <p><strong>Description:</strong> {constellation.description}</p>
            
            <h3>Main Stars:</h3>
            <ul className="stars-list">
              {constellation.main_stars.map((star, index) => (
                <li key={index}>{star}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <Link to="/constellations" className="back-btn">
          Back to All Constellations
        </Link>
      </div>
    </div>
  );
};

export default ConstellationDetail;