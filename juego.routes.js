const express = require('express');
const router = express.Router();
const { updatePuntaje } = require('../controllers/juegoController');

router.put('/api/juego/update/:id', updatePuntaje);

module.exports = router;
