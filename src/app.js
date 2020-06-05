const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const parserRouter = require('./routes/parser');

app.use(cors());
app.use(morgan('dev'));

app.use(parserRouter);

app.get('/', (req, res) => res.json({ hello: 'world' }));

module.exports = app;
