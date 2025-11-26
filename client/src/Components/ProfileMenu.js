import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="profile-wrapper" onClick={() => setOpen(!open)}>
      {/* Profile Image */}
      <img
        src="https://i.ibb.co/8z5H1Zk/profile-user.png"
        className="profile-icon"
        alt="profile"
      />
      {/* Dropdown */}
      {open && (
        <div className="profile-dropdown">
          <Link to="/profile" className="dropdown-item">
            My Profile
          </Link>
          <Link to="/edit-profile" className="dropdown-item">
            Edit Profile
          </Link>
          <Link to="/login" className="dropdown-item logout">
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
