const express = require('express');
const router = express.Router();
const ParserController = require('../controllers/ParserController');

router.get('/', ParserController.index);

module.exports = router;
