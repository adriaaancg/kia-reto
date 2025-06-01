import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SessionStarted.css";

export default function SessionStarted() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Unauthorized access:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 13.1;
    const onTimeUpdate = () => {
      if (video.currentTime >= 20.5) video.currentTime = 13.1;
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  if (!user) return null;

  return (
    <div className="session-screen">
      <video ref={videoRef} autoPlay muted loop playsInline className="session-video">
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="session-container">
        <h1 className="session-title">Bienvenido, {user.username}</h1>
        <p className="session-subtitle">¿Qué deseas hacer hoy?</p>

        <div className="session-cards">
          <div className="session-card" onClick={() => navigate("/waste-dashboard")}>
            <img src="/icons/form.svg" alt="Formulario" />
            <span>Registrar residuos</span>
          </div>
          <div className="session-card" onClick={() => navigate("/waste-history")}>
            <img src="/icons/history.svg" alt="Historial" />
            <span>Ver historial</span>
          </div>
          <div className="session-card" onClick={() => navigate("/waste-dashboard")}>
            <img src="/icons/dashboard.svg" alt="Dashboard" />
            <span>Dashboard de KPIs</span>
          </div>
        </div>
      </div>
    </div>
  );
}