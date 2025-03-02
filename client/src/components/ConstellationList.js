import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';

const ConstellationsList = () => {
  const [constellations, setConstellations] = useState([]);
  const [filteredConstellations, setFilteredConstellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seasonFilter, setSeasonFilter] = useState('all');

  useEffect(() => {
    const fetchConstellations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/constellations');
        setConstellations(response.data);
        setFilteredConstellations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load constellations');
        setLoading(false);
      }
    };

    fetchConstellations();
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      // If search is cleared, just apply the current season filter
      filterBySeason(seasonFilter);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = constellations.filter(
      (constellation) =>
        constellation.name.toLowerCase().includes(term) ||
        constellation.latin_name.toLowerCase().includes(term) ||
        constellation.description.toLowerCase().includes(term) ||
        constellation.main_stars.some(star => star.toLowerCase().includes(term))
    );

    // Apply season filter to search results if needed
    if (seasonFilter !== 'all') {
      setFilteredConstellations(
        filtered.filter(constellation => 
          constellation.visible_season.toLowerCase() === seasonFilter.toLowerCase()
        )
      );
    } else {
      setFilteredConstellations(filtered);
    }
  };

  const filterBySeason = (season) => {
    setSeasonFilter(season);
    
    if (season === 'all') {
      setFilteredConstellations(constellations);
    } else {
      setFilteredConstellations(
        constellations.filter(
          (constellation) => constellation.visible_season.toLowerCase() === season.toLowerCase()
        )
      );
    }
  };

  if (loading) return <div className="container loading">Loading constellations...</div>;

  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">
      <div className="constellation-list">
        <h1>Explore Constellations</h1>
        
        <div className="filters">
          <div className="search-box">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="season-filter">
            <span>Filter by Season: </span>
            <select 
              value={seasonFilter} 
              onChange={(e) => filterBySeason(e.target.value)}
              className="season-select"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>
        
        {filteredConstellations.length === 0 ? (
          <div className="no-results">No constellations match your search criteria</div>
        ) : (
          <div className="card-container">
            {filteredConstellations.map((constellation) => (
              <div key={constellation.id} className="card">
                <img 
                  src={constellation.image_url} 
                  alt={constellation.name} 
                  className="card-image" 
                />
                <div className="card-content">
                  <h2>{constellation.name}</h2>
                  <p className="season-tag">Best in: {constellation.visible_season}</p>
                  <p className="stars-count">{constellation.stars_count} main stars</p>
                  <Link to={`/constellations/${constellation.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstellationsList;