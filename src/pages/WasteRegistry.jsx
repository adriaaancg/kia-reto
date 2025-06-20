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
const art17 = ['Confinamiento', 'Co-procesamiento', 'Reciclaje'];
const reason_art71 = ['LAURA MIREYA NAVARRO CEPEDA', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'CONDUGAS DEL NORESTE S.A. DE C.V.'];
const aut_semarnat = ['19-I-030-D-19', '19-I-001-D-16', '19-I-009-D-18', '19-I-031-D-19'];
const aut_SCT = ['1938SAI07062011230301029', '1938CNO08112011230301036', '1938ESG28112011230301000', '1938NACL13102022230303000', '1938NACL29052015073601001'];
const reason_destination = ['BARRILES METALICOS S.A. de C.V.', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'ECOQUIM S.A. DE C.V.', 'MAQUILADORA DE LUBRICANTES S.A. DE C.V.', 'ELECTRICA AUTOMOTRIZ OMEGA S.A. DE C.V.', 'Geocycle México, S.A. de C.V.','Veolia Soluciones Industriales México, SA de CV','RETALSA SA de CV'];
const aut_destination = ['19-V-62-16', '19-II-004-D-2020', '19-IV-69-16', '19-IV-21-18', '19-21-PS-V-04-94'];
const chemicals = ['C', 'R', 'E', 'T', 'Te', 'Th', 'Tt', 'I', 'B', 'M'];
const responsible = ['Yamileth Cuellar'];



const defaultValuesMap = {
  "Trapos, guantes y textiles contaminados con aceite hidráulico, pintura, thinner y grasa...": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Geocycle México, S.A. de C.V.",
      art71: "Co-procesamiento",
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS S.A. DE CV.",
      aut_semarnat: "19-I-009-D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Plásticos contaminados con aceite hidráulico y pintura...": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. de C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "Geocycle México, S.A. de C.V.",
    art71: "Co-procesamiento"
  },

  "Papel contaminado con pintura proveniente de la actividad de retoque de carrocerías": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "Geocycle México, S.A. de C.V.",
    art71: "Co-procesamiento"
  },

  "Tambos vacíos metálicos contaminados con aceite hidráulico, líquidos para frenos y sello": {
    reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
    aut_semarnat: "19-I-001D-16",
    reason_destination: "BARRILES METALICOS S.A. de C.V.",
    art71: "Reciclaje"
  },

  "Tambos vacíos plásticos contaminados limpiadores con base de hidróxido de potasio": [
    {
      // Option 1:
      reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
      aut_semarnat: "19-I-001D-16",
      reason_destination: "BARRILES METALICOS S.A. de C.V.",
      art71: "Reciclaje"
    },

    {
      // Option 2:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030D-19",
      reason_destination: "RETALSA SA de CV",
      art71: "Reciclaje",
    },

    {
      // Option 3:
      reason_art71: "ECO SERVICIOS PARA GAS S.A. DE CV.",
      aut_semarnat: "19-I-009-D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Lodos de Fosfatizado proveniente de la lavadora de fosfatizado": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
    art71: "Confinamiento"
  },

  "Contenedores vacíos metálicos contaminados de pintura de aceite, aceite hidráulico y sello": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV ",
      art71: "Confinamiento",
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS S.A. DE CV.",
      aut_semarnat: "19-I-009-D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Contenedores vacíos plásticos contaminados de pintura de aceite y aceite hidráulico": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Geocycle México, S.A. de C.V.", "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)"],
    art71: "Confinamiento"
  },
  
  "Aceite Gastado proveniente de mantenimientos": [
    {
      // Option 1:
      reason_art71: "LAURA MIREYA NAVARRO CEPEDA ",
      aut_semarnat: "19-I-001D-16",
      reason_destination: "MAQUILADORA DE LUBRICANTES S.A. DE C.V.",
      art71: ["Reciclaje", "Co-procesamiento"],
    },
    {
      // Option 2:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Asfaltos Energex SA de CV",
      art71: ["Reciclaje", "Co-procesamiento"],
    }
  ],

  "Solventes mezclados con base thinner": [
    {
      // Option 1:
      reason_art71: "CONDUGAS DEL NORESTE, S.A DE C.V",
      aut_semarnat: "19-I-031D-19",
      reason_destination: "ECOQUIM S.A DE C.V",
      art71: "Reciclaje",
    },
    {
      // Option 2:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)",
      art71: ["Reciclaje", "Co-procesamiento"],
    }
  ],

  "Totes contaminados plásticos con aceite hidráulico": {
    reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
    aut_semarnat: "19-I-001D-16",
    reason_destination: "BARRILES METALICOS S.A. de C.V.",
    art71: "Reciclaje"
  },

  "Agua contaminada con pintura": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "AQUAREC, SAPI de CV",
      art71: "Co-procesamiento",
    },
    {
      // Option 2:
      reason_art71: "CONDUGAS DEL NORESTE, S.A DE C.V",
      aut_semarnat: "19-I-031D-19",
      reason_destination: "ECO SERVICIOS PARA GAS S.A. DE C.V.",
      art71: "Co-procesamiento",
    }
  ],

  "Filtros contaminados con pigmentos y agua (Planta tratadora)": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Geocycle México, S.A. de C.V.", "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)"],
    art71: "Co-procesamiento"
  },

  "Sello gastado de aplicación a carcazas": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: ["Geocycle México, S.A. de C.V.", "Sociedad Ecológica Mexicana del Norte SA"],
      art71: ["Co-procesamiento", "Confinamiento"],
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Confinamiento",
    }
  ],

  "Residuos no anatómicos de curaciones": {
    reason_art71: "C. JAIME ISAAC MORENO VILLAREAL",
    aut_semarnat: "5-27-PS-I-316D-11-2017",
    reason_destination: "Roberto Arturo Muñoz del Río",
    art71: "Destrucción Térmica"
  },

  "Objetos punzocortantes médicos": {
    reason_art71: "C. JAIME ISAAC MORENO VILLAREAL",
    aut_semarnat: "5-27-PS-I-316D-11-2017",
    reason_destination: "Roberto Arturo Muñoz del Río",
    art71: "Destrucción Térmica"
  },

  "Pilas alcalinas": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Confinamiento",
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Confinamiento",
    }
  ],

  "Baterías de equipos automotores": {
    reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
    aut_semarnat: "19-I-001D-16",
    reason_destination: "ELÉCTRICA AUTOMOTRIZ OMEGA, SA de CV",
    art71: "Reciclaje"
  },

  "Lodos de clara (residuos casetas pintura)": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)",
    art71: "Co-procesamiento"
  },

  "Rebaba y eslinga metálica impregnada con aceite": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Veolia Soluciones Industriales México, SA de CV", "Sociedad Ecológica Mexicana del Norte SA"],
    art71: "Confinamiento"
  },

  "Lámparas Fluorescentes": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: ["Veolia Soluciones Industriales México, SA de CV", "Sociedad Ecológica Mexicana del Norte SA"],
      art71: ["Confinamiento", "Reciclaje"],
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Reciclaje",
    }
  ],

  "Filtros contaminados con pigmentos y agua (Planta pintura)": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: ["Geocycle México, S.A. de C.V.", "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)"],
      art71: "Confinamiento",
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Contenedores metálicos de gases refrigerantes": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Catalizadores gastados de equipos automotores": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Veolia Soluciones Industriales México, SA de CV", "Sociedad Ecológica Mexicana del Norte SA"],
    art71: "Confinamiento"
  },
  
};



export default function WasteRegistry() {
  const [formData, setFormData] = useState({
    entry_date: null,
    exit_date: null,
    type: null,
    amount: null,
    container: null,
    area: null,
    art71: null,
    reason_art71: null,
    aut_semarnat: null,
    aut_SCT: null,
    reason_destination: null,
    aut_destination: null,
    chemicals: [],
    responsible: null,
  });

  const [mappingIndex, setMappingIndex] = useState(0);

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

  useEffect(() => {
    const mappingData = defaultValuesMap[formData.type];
    if (mappingData) {
      const defaults = Array.isArray(mappingData) ? mappingData[mappingIndex] : mappingData;
      setFormData(prev => {
        // Create an update object only for keys that are empty
        const update = {};
        Object.entries(defaults).forEach(([key, value]) => {
          if (!prev[key] || prev[key] === "") {
            // If the default is an array (like for reason_destination), take the first value
            update[key] = Array.isArray(value) ? value[0] : value;
          }
        });
        return { ...prev, ...update };
      });
    }
  }, [formData.type, mappingIndex]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/waste", formData);
      alert("Registro enviado con éxito");
      // Puedes limpiar el formulario si deseas
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      alert("Error al enviar el registro");
    }
  };
  

  return (
    <div className="waste-registry-screen">
      <Navbar />
      <div className="waste-registry-container">
        <h2>Bitácora de Residuos Peligrosos</h2>
        <form className="waste-registry-form" onSubmit={handleSubmit}>
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
