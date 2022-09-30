const jwt = require('jsonwebtoken');

exports.createToken = usuario => {
    try {
        const payload = {
            sub: usuario._id,
            DPI: usuario.DPI,
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            rol: usuario.rol
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
        return token;
    } catch (err) {
        console.error(err);
    }
}