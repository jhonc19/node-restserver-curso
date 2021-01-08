const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

letrolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido',
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombr es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: [true, 'El correo electronico ya esta siendo usado'],
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: letrolesValidos,
    },
    estado: {
        type: Boolean,
        required: [true, 'El estado es requerido'],
        default: true,
    },
    google: {
        type: Boolean,
        required: [true, 'Es requerido'],
        default: false,
    },
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} esta siendo usado.',
});
module.exports = mongoose.model('Usuario', usuarioSchema);
