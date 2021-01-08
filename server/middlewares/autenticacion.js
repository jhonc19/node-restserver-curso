const jwt = require('jsonwebtoken');

// Verificar Token
let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido',
                },
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

// Verificar ADMIN_ROL
let verificaADMIN_ROL = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador',
            },
        });
    } else {
        next();
    }
};

module.exports = {
    verificaToken,
    verificaADMIN_ROL
};
