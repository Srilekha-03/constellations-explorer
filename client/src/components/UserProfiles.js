// client/src/components/UserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);
  
  if (!currentUser) {
    return <div className="profile-container">Please login to view your profile</div>;
  }
  
  if (loading) return <div className="profile-container">Loading profile...</div>;
  
  if (error) return <div className="profile-container error">{error}</div>;
  
  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      <div className="profile-info">
        <div className="profile-item">
          <strong>Username:</strong> {profile.username}
        </div>
        
        <div className="profile-item">
          <strong>Email:</strong> {profile.email}
        </div>
        
        <div className="profile-item">
          <strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;