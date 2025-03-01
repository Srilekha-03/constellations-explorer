// components/ConstellationList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ConstellationList = () => {
  const [constellations, setConstellations] = useState([]);
  const [filteredConstellations, setFilteredConstellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');

  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/constellations');
        setConstellations(response.data);
        setFilteredConstellations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch constellations');
        setLoading(false);
        console.error(err);
      }
    };

    fetchConstellations();
  }, []);

  useEffect(() => {
    // Filter constellations based on search term and season filter
    const filtered = constellations.filter(constellation => {
      const matchesSearch = constellation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           constellation.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeason = seasonFilter === '' || constellation.visible_season.toLowerCase() === seasonFilter.toLowerCase();
      
      return matchesSearch && matchesSeason;
    });
    
    setFilteredConstellations(filtered);
  }, [searchTerm, seasonFilter, constellations]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSeasonChange = (e) => {
    setSeasonFilter(e.target.value);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/600x400/1a237e/FFFFFF?text=Constellation";
  };

  if (loading) return <div className="loading">Loading constellations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="constellation-list">
      <h1>Constellations</h1>
      
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search constellations..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="season-filter">
          <select value={seasonFilter} onChange={handleSeasonChange} className="season-select">
            <option value="">All Seasons</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </select>
        </div>
      </div>
      
      {filteredConstellations.length === 0 ? (
        <div className="no-results">No constellations found matching your criteria</div>
      ) : (
        <div className="card-container">
          {filteredConstellations.map(constellation => (
            <div key={constellation.id} className="card">
              <img 
                src={constellation.image_url} 
                alt={constellation.name} 
                className="card-image"
                onError={handleImageError}
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
      )}
    </div>
  );
};

export default ConstellationList;