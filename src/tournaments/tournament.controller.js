
const { USER_ROLES } = require('../enums/user.enums');
const { updateTournamentValidation } = require('../services/validator');
const { getUserByIdI } = require('../users/user.controller');
const Tournament = require('./tournament.model');

exports.testTorneo = async (req, res) => {
    return res.send({ message: 'test' });
}

exports.createTorunament = async (req, res) => {
    try {
        const params = req.body;
        const tournament = new Tournament(params);

        if (req.user.rol == USER_ROLES.USER) {
            tournament.usuario = req.user._id;
        }

        const user = await getUserByIdI(tournament.usuario);
        if (!user) {
            return res.status(404).send({ message: 'No existe el usuario' });
        }

        const savedTournament = await tournament.save();

        if (!savedTournament) {
            return res.status(400).send({ message: 'Error al agregar torneo' });
        }

        return res.send({ message: `Torneo "${savedTournament.nombre}" creado exitosamente` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err, message: 'Error al guardar torneo' });
    }
}

exports.getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find()
            .populate('usuario', 'DPI nombre apellido usuario');

        return res.send({ tournaments });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err, message: 'Error obteniendo torneos' });
    }
}

exports.getUserTournaments = async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user._id != userId) {
            return res.status(403).send({ message: 'No tienes acceso a estos torneos' });
        }

        let tournaments = await Tournament.find({ usuario: userId }).populate('usuario', 'DPI nombre apellido usuario');
        if (!tournaments.length) {
            return res.status(404).send({ message: 'No se encontraron torneos para el usuario' });
        }

        return res.send({ tournaments });
    } catch (err) {
        return res.status(500).send({ error: err, message: 'Error obteniendo torneos del usuario' });
    }
}

exports.getTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const tournament = await Tournament.findOne({ _id: tournamentId }).populate('usuario', 'DPI nombre apellido usuario');
        if (!tournament) {
            return res.status(404).send({ message: 'No se encontró el torneo' });
        }

        if (req.user.rol == USER_ROLES.USER && tournament?.usuario != req.user._id) {
            return res.status(403).send({ message: 'No tiene permisos para acceder al torneo' });
        }

        return res.send({ tournament });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error obteniendo torneo' });
    }
}

exports.updateTournament = async (req, res) => {
    try {
        const params = req.body;
        if (updateTournamentValidation(params)) {
            return res.status(400).send({ message: 'Algunos datos enviados no se pueden actualizar' });
        }

        const tournamentId = req.params.id;
        const updateTournamentObject = {
            nombre: params.nombre,
            fechaFin: params.fechaFin,
            activo: params.activo,
            usuario: params.usuario,
            equipos: params.equipos
        }

        const tournamentExist = await Tournament.findOne({ _id: tournamentId });
        if (!tournamentExist) {
            return res.status(404).send({ message: 'No se encontró el torneo' });
        }

        if (req.user.rol == USER_ROLES.USER) {
            if (tournamentExist.usuario != req.user._id) {
                return res.status(403).send({ message: 'No tiene permiso para editar torneo' });
            }
        }

        if (!getUserByIdI(updateTournamentObject.usuario)) {
            return res.status(404).send({ message: 'Usuario a asignar torneo no encontrado' });
        }

        const tournament = await Tournament
            .findOneAndUpdate({ _id: tournamentId }, updateTournamentObject, { new: true })
            .populate('usuario', 'DPI nombre apellido usuario');

        return res.send({ tournament });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error obteniendo torneo' });
    }
}

exports.deactivateTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const tournamentExist = await Tournament.findOne({ _id: tournamentId }).populate('usuario', 'DPI nombre apellido usuario');
        if (!tournamentExist) {
            return res.status(404).send({ message: 'No se encontró el torneo' });
        }

        if (req.user.rol == USER_ROLES.USER && tournamentExist.usuario != req.user._id) {
            return res.status(403).send({ message: 'No tiene permiso para editar torneo' });
        }

        const tournament = await Tournament.findOneAndUpdate({ _id: tournamentId }, { activo: false }, { new: true });
        return res.send({ tournament });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error eliminando torneo' });
    }
}



