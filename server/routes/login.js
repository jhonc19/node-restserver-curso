const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario
        },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario,
            token
        });
    })
});

module.exports = app;
