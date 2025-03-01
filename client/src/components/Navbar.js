// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Constellation Explorer</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/constellations">Constellations</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;