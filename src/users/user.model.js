'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { hashField } = require('../services/bcrypt');
const { USER_ROLES } = require('../enums/user.enums');

const UserSchema = Schema({
    DPI: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    usuario: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    contrasenia: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        uppercase: true
    }
}, {
    versionKey: false,
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    try {
        let usuario = this;
        usuario.contrasenia = await hashField(usuario.contrasenia);
        if (Object.values(USER_ROLES).includes(usuario.rol)) {
            return next();
        }
        return next('Rol inválido');
    } catch (err) {
        console.error(err);
        return next('Error al encriptar contraseña');
    }
});

UserSchema.pre(/(findOneAndUpdate)/, async function (next) {
    try {
        let usuario = this._update;
        if (!usuario.contrasenia) {
            return next();
        }
        usuario.contrasenia = await hashField(usuario.contrasenia);
        if (!usuario.rol || Object.values(USER_ROLES).includes(usuario.rol)) {
            return next();
        }
        return next('Rol inválido');
    } catch (err) {
        console.error(err);
        return next('Error al encriptar contraseña');
    }
});

module.exports = mongoose.model('Usuario', UserSchema);