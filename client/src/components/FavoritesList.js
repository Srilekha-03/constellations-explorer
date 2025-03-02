import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const FavoritesList = () => {
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/favorites');
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load favorites');
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);
  
  const handleRemoveFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${id}`);
      // Update state to remove the deleted favorite
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (err) {
      setError('Failed to remove from favorites');
    }
  };
  
  if (!currentUser) {
    return <div className="favorites-container">Please login to view your favorites</div>;
  }
  
  if (loading) return <div className="favorites-container">Loading favorites...</div>;
  
  if (error) return <div className="favorites-container error">{error}</div>;
  
  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <h2>My Favorite Constellations</h2>
        <p>You haven't added any constellations to your favorites yet.</p>
        <Link to="/constellations" className="btn">Browse Constellations</Link>
      </div>
    );
  }
  
  return (
    <div className="favorites-container">
      <h2>My Favorite Constellations</h2>
      
      <div className="constellations-grid">
        {favorites.map(constellation => (
          <div key={constellation.id} className="constellation-card">
            <img src={constellation.image_url} alt={constellation.name} />
            <h3>{constellation.name}</h3>
            <p>Season: {constellation.visible_season}</p>
            <div className="card-actions">
              <Link to={`/constellations/${constellation.id}`} className="btn">View Details</Link>
              <button 
                onClick={() => handleRemoveFavorite(constellation.id)} 
                className="btn-remove"
              >
                Remove from Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;