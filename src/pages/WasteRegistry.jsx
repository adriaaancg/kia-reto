import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteRegistry.css";

const type = [
  'Trapos, guantes y textiles contaminados con aceite hidráulico, pintura, thinner y grasa...',
  'Plásticos contaminados con aceite hidráulico y pintura...',
  'Papel contaminado con pintura proveniente de la actividad de retoque de carrocerías',
  'Tambos vacíos metálicos contaminados con aceite hidráulico, líquidos para frenos y sello',
  'Tambos vacíos plásticos contaminados limpiadores con base de hidróxido de potasio',
  'Lodos de Fosfatizado proveniente de la lavadora de fosfatizado',
  'Contenedores vacíos metálicos contaminados de pintura de aceite, aceite hidráulico y sello',
  'Contenedores vacíos plásticos contaminados de pintura de aceite y aceite hidráulico',
  'Aceite Gastado proveniente de mantenimientos',
  'Solventes mezclados con base thinner',
  'Totes contaminados plásticos con aceite hidráulico',
  'Agua contaminada con pintura',
  'Filtros contaminados con pigmentos y agua (Planta tratadora)',
  'Sello gastado de aplicación a carcazas',
  'Residuos no anatómicos de curaciones',
  'Objetos punzocortantes médicos',
  'Pilas alcalinas',
  'Baterías de equipos automotores',
  'Lodos de clara (residuos casetas pintura)',
  'Rebaba y eslinga metálica impregnada con aceite',
  'Lámparas fluorescentes',
  'Filtros contaminados con pigmentos y agua (Planta pintura)',
  'Contenedores metálicos de gases refrigerantes',
  'Catalizadores gastados de equipos automotores',
  'Baterías automotrices de litio metálico'
];
const contenedores = ['Paca', 'Pieza', 'Tambo', 'Tarima', 'Tote'];
const areas = ['Assembly', 'HO', 'Paint', 'PTAR', 'Stamping', 'Utility', 'Vendors', 'Welding'];
const art17 = ['Confinamiento', 'Coprocesamiento', 'Reciclaje'];
const reason_art71 = ['LAURA MIREYA NAVARRO CEPEDA', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'CONDUGAS DEL NORESTE S.A. DE C.V.'];
const aut_semarnat = ['19-I-030-D-19', '19-I-001-D-16', '19-I-009-D-18', '19-I-031-D-19'];
const aut_SCT = ['1938SAI07062011230301029', '1938CNO08112011230301036', '1938ESG28112011230301000', '1938NACL13102022230303000', '1938NACL29052015073601001'];
const reason_destination = ['BARRILES METALICOS S.A. de C.V.', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'ECOQUIM S.A. DE C.V.', 'MAQUILADORA DE LUBRICANTES S.A. DE C.V.', 'ELECTRICA AUTOMOTRIZ OMEGA S.A. DE C.V.'];
const aut_destination = ['19-V-62-16', '19-II-004-D-2020', '19-IV-69-16', '19-IV-21-18', '19-21-PS-V-04-94'];
const chemicals = ['C', 'R', 'E', 'T', 'Te', 'Th', 'Tt', 'I', 'B', 'M'];
const responsible = ['Yamileth Cuellar'];

export default function WasteRegistry() {
  const [formData, setFormData] = useState({
    entry_date: '',
    exit_date: '',
    type: '',
    amount: '',
    container: 'Ton',
    area: '',
    art71: '',
    reason_art71: '',
    aut_semarnat: '',
    aut_SCT: '',
    reason_destination: '',
    aut_destination: '',
    chemicals: [],
    responsible: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        chemicals: checked
          ? [...prev.chemicals, value]
          : prev.chemicals.filter((q) => q !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="waste-registry-screen">

      <Navbar />

      <div className="waste-registry-container">
        <h2>Bitácora de Residuos Peligrosos</h2>


        <form className="waste-registry-form">
        <div>
          <label>Fecha de ingreso:</label>
          <input type="date" name="entry_date" value={formData.entry_date} onChange={handleChange}/>
        </div>

        <div>
          <label>Fecha de salida:</label>
          <input type="date" name="exit_date" value={formData.exit_date} onChange={handleChange}/>
        </div>

        <div>
          <label>Tipo de residuo:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Seleccione tipo de residuo</option>
            {type.map((res, i) => <option key={i} value={res}>{res}</option>)}
          </select>
        </div>

        <div>
          <label>Cantidad (toneladas):</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
        </div>

        <div>
          <label>Tipo de contenedor:</label>
          <select name="container" value={formData.container} onChange={handleChange}>
            <option value="">Seleccione tipo de contenedor</option>
            {contenedores.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>Área generadora:</label>
          <select name="area" value={formData.area} onChange={handleChange}>
            <option value="">Seleccione área</option>
            {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label>Artículo 71:</label>
          <select name="art71" value={formData.art71} onChange={handleChange}>
            <option value="">Seleccione opción</option>
            {art17.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label>Razón social (artículo 71):</label>
          <select name="reason_art71" value={formData.reason_art71} onChange={handleChange}>
            <option value="">Seleccione razón social</option>
            {reason_art71.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label>Autorización SEMARNAT:</label>
          <select name="aut_semarnat" value={formData.aut_semarnat} onChange={handleChange}>
            <option value="">Seleccione autorización</option>
            {aut_semarnat.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label>Autorización SCT:</label>
          <select name="aut_SCT" value={formData.aut_SCT} onChange={handleChange}>
            <option value="">Seleccione autorización</option>
            {aut_SCT.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label>Destino del residuo:</label>
          <select name="reason_destination" value={formData.reason_destination} onChange={handleChange}>
            <option value="">Seleccione destino</option>
            {reason_destination.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label>Autorización del destino:</label>
          <select name="aut_destination" value={formData.aut_destination} onChange={handleChange}>
            <option value="">Seleccione autorización</option>
            {aut_destination.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label>CRETI:</label>
          <div className="flex flex-wrap gap-2">
            {chemicals.map((q, i) => (
              <label key={i} className="flex items-center gap-1">
                <input type="checkbox" value={q} checked={formData.chemicals.includes(q)} onChange={handleChange} />
                {q}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Responsable:</label>
          <select name="responsible" value={formData.responsible} onChange={handleChange}>
            <option value="">Seleccione responsable</option>
            {responsible.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
      </div>

      <button type="submit" className="logwaste-submit-btn">Submit Registry for Review</button>

    </form>

      </div>
    </div>
  );
}
