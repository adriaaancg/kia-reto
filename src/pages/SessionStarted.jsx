import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/SessionStarted.css";

export default function SessionStarted() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ total: 0, areas: [] });
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    setSummary({
      total: 324,
      areas: [
        { area: "Producción", amount: 120 },
        { area: "Mantenimiento", amount: 90 },
        { area: "Almacén", amount: 114 },
      ],
    });
  }, []);

  if (!user) return null;

  return (
    <div className="session-screen">
      <video ref={videoRef} autoPlay muted loop playsInline className="session-video">
        <source src="/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <Navbar username={user.username} />

      <div className="session-container">
        <h1 className="session-title">Bienvenido, {user.username}</h1>
        <p className="session-subtitle">¿Qué deseas hacer hoy?</p>

        <div className="session-cards">
          <div className="session-card" onClick={() => navigate("/waste-registry")}>
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

          {user.username === "01234644" && (
            <div className="session-card" onClick={() => navigate("/pending-requests")}>
              <img src="/icons/admin.svg" alt="Solicitudes" />
              <span>Solicitudes</span>
            </div>
          )}
        </div>

        <div className="session-dashboard">
          <h2>Resumen General</h2>
          <p>Total de residuos registrados: <strong>{summary.total}</strong></p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.areas}>
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}