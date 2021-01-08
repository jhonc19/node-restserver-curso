const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
require('./config/config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});
