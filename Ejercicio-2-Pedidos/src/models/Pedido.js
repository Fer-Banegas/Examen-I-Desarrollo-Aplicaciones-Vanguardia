const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  clienteNombre: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
    validate: {
      validator: (total) => Number.isFinite(total) && total > 0,
      message: 'El total debe ser un número mayor que cero.',
    },
  },
  estado: {
    type: String,
    enum: ['pendiente', 'enviado', 'entregado'],
    default: 'pendiente',
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  productos: {
    type: [String],
    default: undefined,
  },
}, {
  autoCreate: false,
  versionKey: false,
});

module.exports = mongoose.model('Pedido', pedidoSchema);
