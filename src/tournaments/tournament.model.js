const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../users/user.model');

const TournamentSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    fechaInicio: {
        type: Date,
        require: true,
    },
    fechaFin: {
        type: Date,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true,
    },
    usuario: {
        type: mongoose.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    equipos: {
        type: Array,
        default: [],
        validate: {
            validator: function (v, x, z) {
                return !(this.equpipos?.length > 10);
            },
            message: props => `${props?.value} exceeds maximum array size (10)!`
        },
    }
}, {
    timestamp: true,
    versionKey: false,
});

module.exports = mongoose.model('Torneo', TournamentSchema);