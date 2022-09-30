'use strict';

const User = require('./user.model');
const { compareWithHash } = require('../services/bcrypt');
const { createToken } = require('../services/jwt');
const { updateUserValidation } = require('../services/validator');
const { USER_ROLES } = require('../enums/user.enums');

exports.test = async (req, res) => {
    return res.send({ message: 'Hola' });
}

exports.saveUser = async (req, res) => {
    try {
        const params = req.body;
        const user = new User(params);

        const savedUser = await user.save();
        if (!savedUser) {
            return res.status(400).send({ message: 'Error al guardar usuario' });
        }

        return res.send({ message: 'Usuario guardado con valor: ' + savedUser.usuario });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err, message: 'Error guardando usuario' });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.send({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err, message: 'Error al obtener los usuarios' })
    }
}

exports.login = async (req, res) => {
    try {
        const params = req.body;

        const user = await User.findOne({ usuario: params.usuario });
        if (user && await compareWithHash(params.contrasenia, user.contrasenia)) {
            const token = createToken(user);
            return res.send({ token, message: 'Usuario encontrado: ' + user.usuario });
        }

        return res.send({ message: 'Credenciales inválidas' })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err, message: 'Error al iniciar sesión' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const idUser = req.params.id;

        const params = req.body;
        if (updateUserValidation(params)) {
            return res.status(400).send({ message: 'Algunos datos enviados no se pueden actualizar' });
        }

        const user = await User.findOne({ _id: idUser });
        if (!user) {
            return res.status(400).send({ message: 'No existe el usuario a actualizar' });
        }

        if (user.rol === USER_ROLES.ADMINISTRATOR) {
            return res.status(403).send({ message: 'No puedes actualizar el usuario' });
        }

        const updatedUser = await User.findOneAndUpdate({ _id: idUser }, params, { new: true });
        return res.send({ user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err, message: 'Error al actualizar usuario' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        let userId = req.params.id;
        const admin = JSON.parse(process.env.ADMIN);
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send({ message: 'No existe el usuario a eliminar' });
        }
        if (user.usuario === admin.usuario) {
            return res.status(404).send({ error: err, message: 'No es posible eliminar al usuario' });
        }
        // TODO: TRASLADAR TORNEOS ANTES DE ELIMINAR USUARIO

        let deletedUser = await User.findOneAndDelete({ _id: userId });
        return res.send({ user: deletedUser, message: `Usuario "${user.usuario}" eliminado exitosamente` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err, message: 'Error al eliminar usuario' });
    }
}

exports.getUser = async (req, res) => {
    try {
        let userId = req.params.id;

        let user = await getUserByIdI(userId);
        if (!user) {
            return res.status(404).send({ message: 'No existe el usuario' });
        }

        return res.send({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err, message: 'Error al obtener usuario' });
    }
}

exports.createAdminDefaultUser = async () => {
    try {
        let admin = JSON.parse(process.env.ADMIN);

        const createdAdmin = await User.findOne({ usuario: admin.usuario });
        if (createdAdmin) {
            return console.log('Usuario administrador ya existente');
        }

        const adminUser = new User(admin);
        await adminUser.save();

        console.log('Usuario administrador creado');
    } catch (err) {
        console.error(err);
    }
}

exports.getUserByIdI = async idUser => await User.findOne({ _id: idUser });

