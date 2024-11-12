const mongoose = require('mongoose');

// Definir el esquema para la orden de trabajo
const ordenSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true,
    },
    patente: {
        type: String,
        required: true,
    },
    cliente: {
        type: String,
        required: true,
    },
    trabajo: {
        type: String,
        required: true,
        minlength: 100, // Asegurarse de que haya al menos 200 palabras
    },
    precio: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

// Crear el modelo para las órdenes de trabajo
const Orden = mongoose.model('Orden', ordenSchema);

module.exports = Orden;
