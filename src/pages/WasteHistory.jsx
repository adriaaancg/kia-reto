import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteHistory.css";

export default function WasteHistory() {
  const videoRef = useRef(null);
  const [records, setRecords] = useState([]);

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
    const fetchRecords = async () => {
      try {
        const res = await axiosInstance.get("/api/waste/history");
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="history-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="history-video"
      >
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <Navbar />

      <div className="history-container">
        <h1>Historial de Residuos</h1>
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Tipo</th>
                <th>Cantidad (kg)</th>
                <th>Área</th>
                <th>SEMARNAT</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, index) => (
                <tr key={index}>
                  <td>{r.entry_date}</td>
                  <td>{r.exit_date}</td>
                  <td>{r.type}</td>
                  <td>{r.amount}</td>
                  <td>{r.area}</td>
                  <td>{r.aut_semarnat}</td>
                  <td>{r.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}