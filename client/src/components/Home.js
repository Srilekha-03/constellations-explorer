import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Constellation Explorer</h1>
      <p>Discover the wonders of the night sky and learn about different constellations.</p>
      <div className="home-cta">
        <Link to="/constellations" className="btn btn-primary">
          Explore Constellations
        </Link>
      </div>
      <div className="home-image">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Constellations_ecliptic_equirectangular_plot.svg/1200px-Constellations_ecliptic_equirectangular_plot.svg.png" 
          alt="Night sky with constellations" 
        />
      </div>
    </div>
  );
};

export default Home;