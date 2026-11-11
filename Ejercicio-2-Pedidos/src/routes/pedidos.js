const express = require('express');
const Pedido = require('../models/Pedido');

const router = express.Router();
const camposPermitidos = ['clienteNombre', 'total', 'estado', 'fecha', 'productos'];
const estadosPermitidos = Pedido.schema.path('estado').enumValues;

router.post('/', async (req, res) => {
  const datos = req.body;
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return res.status(400).json({ mensaje: 'Envía los datos del pedido como un objeto JSON.' });
  }

  if (Object.keys(datos).some((campo) => !camposPermitidos.includes(campo))) {
    return res.status(400).json({ mensaje: 'El cuerpo contiene campos que no pertenecen al pedido.' });
  }

  if (Object.hasOwn(datos, 'clienteNombre') && typeof datos.clienteNombre !== 'string') {
    return res.status(400).json({ mensaje: 'clienteNombre debe ser un texto.' });
  }

  if (Object.hasOwn(datos, 'total') && typeof datos.total !== 'number') {
    return res.status(400).json({ mensaje: 'El total debe ser un número mayor que cero.' });
  }

  if (Object.hasOwn(datos, 'productos')
      && (!Array.isArray(datos.productos) || datos.productos.some((producto) => typeof producto !== 'string'))) {
    return res.status(400).json({ mensaje: 'productos debe ser un arreglo de cadenas.' });
  }

  const pedido = await Pedido.create(datos);
  res.status(201).json(pedido);
});

router.get('/', async (req, res) => {
  const pedidos = await Pedido.find();
  res.status(200).json(pedidos);
});

router.get('/estado/:estado', async (req, res) => {
  const { estado } = req.params;
  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'El estado debe ser pendiente, enviado o entregado.' });
  }

  const pedidos = await Pedido.find({ estado });
  res.status(200).json(pedidos);
});

module.exports = router;
