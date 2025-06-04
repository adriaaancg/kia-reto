import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedUser, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!loggedUser) return null;

  const isAdmin = loggedUser.username === "01234644";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/assets/kia-logo-white.png" alt="KIA" className="navbar-logo" />
        <span className="navbar-username">{loggedUser.username}</span>
      </div>

      <div className="navbar-center">
        {isAdmin ? (
          <>
            <Link to="/pending-requests">Requests</Link>
            <Link to="/waste-registry">Registry</Link>
            <Link to="/waste-history">History</Link>
            <Link to="/waste-registry-confirmed">Confirmed</Link>
            <Link to="/waste-dashboard">Dashboards</Link>
            <button className="navbar-logout" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/waste-registry">Registry</Link>
            <Link to="/waste-history">History</Link>
            <Link to="/waste-dashboard">Dashboards</Link>
            <button className="navbar-logout" onClick={handleLogout}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
}