const { body, validationResult } = require('express-validator');

exports.guardar = [
    body('correo', 'Correo electrónico inválido')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('DPI', 'DPI inválido no contiene la longitud correcta')
        .trim()
        .isLength({ min: 8 })
]

exports.validacionGuardar = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).send({ err });
    }
}

exports.updateUserValidation = user => {
    return !(user?._id ||
        user?.DPI ||
        user?.nombre ||
        user?.apellido ||
        Object.entries(user).length !== 0)
}

exports.updateTournamentValidation = tournament => {
    return !(tournament?._id ||
        tournament?.nombre ||
        tournament?.fechaFin ||
        tournament?.activo ||
        tournament?.usuario ||
        tournament?.equipos ||
        Object.entries(user).length !== 0)
}