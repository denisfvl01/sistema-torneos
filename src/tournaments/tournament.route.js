const express = require('express');
const { ensureAuth, ensureIsAdmin } = require('../middlewares/ensureAuth');
const { updateTournamentValidation, validacionGuardar } = require('../services/validator');
const api = express.Router();

const tournamentController = require('./tournament.controller');

api.get('/test', [ensureAuth], tournamentController.testTorneo);
api.post('/', [ensureAuth], validacionGuardar, tournamentController.createTorunament);
api.get('/', [ensureAuth, ensureIsAdmin], tournamentController.getTournaments);
api.get('/:id', [ensureAuth], tournamentController.getTournament);
api.put('/:id', [ensureAuth], tournamentController.updateTournament);


module.exports = api;