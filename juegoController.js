const db = require('../database/db');



const updatePuntaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntaje } = req.body;

    const result = await db.query(
      'UPDATE juego SET puntaje = $1 WHERE user_id = $2 RETURNING *',
      [puntaje, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Puntaje actualizado correctamente', juego: result.rows[0] });
  } catch (error) {
    console.error('Error en updatePuntaje:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = {
  updatePuntaje,
};
