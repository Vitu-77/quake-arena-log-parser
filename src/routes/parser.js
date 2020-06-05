const express = require('express');
const router = express.Router();
const ParserController = require('../controllers/ParserController');

router.get('/games', ParserController.index);
router.get('/game/:id', ParserController.show);

module.exports = router;
