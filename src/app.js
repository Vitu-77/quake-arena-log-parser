const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const parserRouter = require('./routes/parser');
const rankingRouter = require('./routes/ranking');

app.use(cors());
app.use(morgan('dev'));

app.use(parserRouter);
app.use(rankingRouter);

app.get('/', (req, res) => {
	return res.send(`
        <h3>Endpoints:</h3>
        <ul>
            <li>
                <strong>GET /games -> </strong><span>Return all games</span>
            </li>
            <li>
                <strong>GET /game/:id -> </strong><span>Find a game by ID</span>
            </li>
            <li>
                <strong>GET /ranking </strong><span>Return global ranking of player by kills</span>
            </li>
        </ul>
    `);
});

module.exports = app;
