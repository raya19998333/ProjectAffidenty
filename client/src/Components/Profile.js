import React from "react";
import "../App.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile() {
  const { user } = useSelector((state) => state.users);
  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">My Profile</h1>
      <div className="profile-card">
        <img
          src={user.profilePic || "https://via.placeholder.com/150"}
          alt="profile"
          className="profile-avatar"
        />
        <div className="profile-name">{user.name || "Unknown User"}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-role">{user.role || "Student"}</div>
        <Link className="profile-edit-btn" to="/edit-profile">
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
