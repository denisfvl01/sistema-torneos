'use strict';

const jwt = require('jsonwebtoken');
const { USER_ROLES } = require('../enums/user.enums');
const { getUserByIdI } = require('../users/user.controller');

exports.ensureAuth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('La petición no contiene la cabecera de autenticación');
        }

        const payload = getPayload(req);
        req.user = await getUserByIdI(payload.sub);

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: err.message });
    }
}

exports.ensureIsAdmin = async (req, res, next) => {
    try {
        if (req.user.rol != USER_ROLES.ADMINISTRATOR) {
            return res.status(403).send({ message: 'No tienes permiso para acceder' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(403).send({ message: error.message });
    }
}

exports.ensureIsUser = async (req, res, next) => {
    try {
        if (req.user.rol != USER_ROLES.USER) {
            return res.status(403).send({ message: 'No tienes permiso para acceder' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(403).send({ message: error.message });
    }
}

exports.ensureIsSupervisor = async (req, res, next) => {
    try {
        if (req.user.rol != USER_ROLES.SUPERVISOR) {
            return res.status(403).send({ message: 'No tienes permiso para acceder' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(403).send({ message: error.message });
    }
}

exports.ensureIsAdminPrincipal = async (req, res, next) => {
    try {
        const admin = JSON.parse(process.env.ADMIN);
        if (req.user.usuario != admin.usuario) {
            return res.status(403).send({ message: 'No tienes permiso para acceder' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(403).send({ message: error.message });
    }
}

function getPayload(req) {
    let token = req.headers.authorization.replace(/['"]+/g, '');
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}