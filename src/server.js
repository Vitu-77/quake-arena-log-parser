const express = require('express');
const cors = require('cors');
var morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ hello: 'world' }));

app.listen(port, () => console.log());
