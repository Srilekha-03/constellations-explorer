// components/StarMap.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StarMap = ({ constellations }) => {
  const [hoveredConstellation, setHoveredConstellation] = useState(null);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  
  // Star data - this would normally come from a database
  // Format: [x, y, size, brightness]
  const stars = [
    [150, 120, 3, 0.9],  // Betelgeuse (Orion)
    [180, 190, 2.5, 0.8], // Rigel (Orion)
    [160, 150, 2, 0.7],   // Bellatrix (Orion)
    [170, 170, 2, 0.7],   // Mintaka (Orion)
    [420, 150, 3, 0.9],   // Dubhe (Ursa Major)
    [450, 180, 2.5, 0.8], // Merak (Ursa Major)
    [470, 200, 2, 0.7],   // Phecda (Ursa Major)
    [250, 300, 3, 0.9],   // Regulus (Leo)
    [290, 330, 2.5, 0.8], // Denebola (Leo)
    [270, 315, 2, 0.7],   // Algieba (Leo)
    [100, 400, 3, 0.9],   // Shedar (Cassiopeia)
    [130, 380, 2.5, 0.8], // Caph (Cassiopeia)
    [160, 390, 2, 0.7],   // Gamma Cassiopeiae (Cassiopeia)
    [350, 80, 3, 0.9],    // Deneb (Cygnus)
    [380, 120, 2.5, 0.8], // Sadr (Cygnus)
    [400, 150, 2, 0.7],   // Gienah (Cygnus)
    // Add more stars as needed
  ];
  
  // Constellation outlines (simplified)
  const constellationData = [
    {
      id: 1, // Orion
      name: "Orion",
      path: "M150,120 L160,150 L170,170 L180,190",
      center: [165, 155]
    },
    {
      id: 2, // Ursa Major
      name: "Ursa Major",
      path: "M420,150 L450,180 L470,200 L490,210 L510,200 L520,220",
      center: [480, 190]
    },
    {
      id: 3, // Leo
      name: "Leo",
      path: "M250,300 L270,315 L290,330 L310,320",
      center: [280, 315]
    },
    {
      id: 4, // Cassiopeia
      name: "Cassiopeia",
      path: "M100,400 L130,380 L160,390 L190,370 L220,390",
      center: [160, 385]
    },
    {
      id: 5, // Cygnus
      name: "Cygnus",
      path: "M350,80 L380,120 L400,150 L420,180 L370,140 L360,170",
      center: [380, 130]
    }
  ];
  
  const handleConstellationClick = (constellationId) => {
    setSelectedConstellation(constellationId);
  };
  
  const handleConstellationHover = (constellationId) => {
    setHoveredConstellation(constellationId);
  };
  
  const handleConstellationLeave = () => {
    setHoveredConstellation(null);
  };
  
  return (
    <div className="star-map-container">
      <h2>Interactive Star Map</h2>
      <p>Click on a constellation to learn more about it</p>
      
      <div className="star-map">
        <svg viewBox="0 0 600 500" className="night-sky">
          {/* Background */}
          <rect width="600" height="500" fill="#0a0e29" />
          
          {/* Stars */}
          {stars.map((star, index) => (
            <circle
              key={index}
              cx={star[0]}
              cy={star[1]}
              r={star[2]}
              fill="white"
              opacity={star[3]}
            />
          ))}
          
          {/* Constellation lines */}
          {constellationData.map((constellation) => (
            <path
              key={constellation.id}
              d={constellation.path}
              stroke={hoveredConstellation === constellation.id || selectedConstellation === constellation.id ? "#ffcc00" : "#8899cc"}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray={hoveredConstellation === constellation.id ? "5,3" : "none"}
              style={{cursor: "pointer"}}
              onClick={() => handleConstellationClick(constellation.id)}
              onMouseEnter={() => handleConstellationHover(constellation.id)}
              onMouseLeave={handleConstellationLeave}
            />
          ))}
          
          {/* Constellation names */}
          {constellationData.map((constellation) => (
            <g key={`name-${constellation.id}`}>
              <text
                x={constellation.center[0]}
                y={constellation.center[1]}
                textAnchor="middle"
                fill={(hoveredConstellation === constellation.id || selectedConstellation === constellation.id) ? "#ffcc00" : "#aabbdd"}
                fontSize="12"
                fontWeight={hoveredConstellation === constellation.id ? "bold" : "normal"}
                style={{cursor: "pointer", userSelect: "none"}}
                onClick={() => handleConstellationClick(constellation.id)}
                onMouseEnter={() => handleConstellationHover(constellation.id)}
                onMouseLeave={handleConstellationLeave}
              >
                {constellation.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      {selectedConstellation && (
        <div className="constellation-info">
          <h3>Selected: {constellationData.find(c => c.id === selectedConstellation)?.name}</h3>
          <Link 
            to={`/constellations/${selectedConstellation}`} 
            className="btn btn-primary"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default StarMap;