import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedUser, setUser] = useState("");

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        const loggedUser = res.data.user;
        setUser(loggedUser);

      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndRequests();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/assets/kia-logo-white.png" alt="KIA" style={{height: "40px"}} />
        <p>{loggedUser.username}</p>
      </div>

      <div className="navbar-routes">
        <div className="pages"> 
          <Link to="/waste-registry">Registry</Link>
          <Link to="/waste-history">History</Link>
          <Link to="/waste-dashboard">Dashboards</Link>         
          <Link to="/waste-registry-confirmed">Documents</Link>
          <Link to="/pending-requests">Pending Users</Link>

        </div>
        
        <button className="navbar-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
      
    </nav>
  );
}
