const express = require('express');
const rankingRouter = express.Router();
const RankingController = require('../controllers/RankingController');

rankingRouter.get('/ranking', RankingController.index);

module.exports = rankingRouter;
