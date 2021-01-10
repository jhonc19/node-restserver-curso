const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {
    Producto.find({estado: true})
        .populate('categoria', 'descripcion estado')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            };

            Producto.countDocuments({estado: true}, (err, count) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    count
                });
            });
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion estado')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB || !productoDB.estado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado o deshabilitado'
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            });
        })
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex, estado: true})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (productos.length == 0) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontro productos con el termino ' + termino
                    }
                })
            };

            res.json({
                ok: true,
                productos
            })
        })
});

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.state(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado, ID incorrecto',
                },
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        });
    });
});

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Producto no encontrado, ID incorrecto'
                }
            });
        };

        res.json({
            ok: true,
            productoDB
        });
    });
});


module.exports = app;