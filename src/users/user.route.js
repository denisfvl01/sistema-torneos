'use strict'

const express = require('express');
const api = express.Router();

const { ensureAuth, ensureIsAdmin, ensureIsAdminPrincipal, ensureIsUser } = require('../middlewares/ensureAuth');
const { guardar, validacionGuardar } = require('../services/validator');

const { test, saveUser, getUsers, updateUser, deleteUser, login } = require('./user.controller');
const tournamentController = require('../tournaments/tournament.controller');

api.get('/test', [ensureAuth], test);
api.post('/', [ensureAuth, ensureIsAdmin], [guardar, validacionGuardar], saveUser);
api.get('/', [ensureAuth, ensureIsAdmin], getUsers);
api.put('/:id', [ensureAuth, ensureIsAdmin], updateUser);
api.delete('/:id', [ensureAuth, ensureIsAdminPrincipal], deleteUser);
api.get('/:id/torneos', [ensureAuth, ensureIsUser], tournamentController.getUserTournaments)



api.post('/login', login);

module.exports = api;