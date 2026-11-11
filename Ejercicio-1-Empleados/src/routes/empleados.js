const express = require('express');
const Empleado = require('../models/Empleado');

const router = express.Router();
const camposPermitidos = ['nombre', 'puesto', 'salario', 'activo'];

function validarDatos(body, esCreacion) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Envía un objeto JSON con los datos del empleado.';
  }

  const campos = Object.keys(body);
  if (campos.length === 0 || campos.some((campo) => !camposPermitidos.includes(campo))) {
    return 'Envía únicamente los campos nombre, puesto, salario o activo.';
  }

  for (const campo of ['nombre', 'puesto']) {
    if (esCreacion || Object.hasOwn(body, campo)) {
      const valor = body[campo];
      if (typeof valor !== 'string' || !valor.trim() || [...valor].length > 255) {
        return `El campo ${campo} debe contener texto de hasta 255 caracteres.`;
      }
    }
  }

  if (esCreacion || Object.hasOwn(body, 'salario')) {
    const { salario } = body;
    const esDecimal = (typeof salario === 'string' || typeof salario === 'number')
      && /^\d+(\.\d{1,2})?$/.test(String(salario));
    if (!esDecimal || Number(salario) < 0.01 || Number(salario) > 99999999.99) {
      return 'El salario debe estar entre 0.01 y 99999999.99 y tener hasta dos decimales.';
    }
  }

  if (Object.hasOwn(body, 'activo') && typeof body.activo !== 'boolean') {
    return 'El campo activo debe ser booleano.';
  }
}

router.param('id', async (req, res, next, valor) => {
  const id = Number(valor);
  if (!/^\d+$/.test(valor) || id < 1 || id > 2147483647) {
    return res.status(400).json({ mensaje: 'El ID debe ser un entero positivo válido.' });
  }

  const empleado = await Empleado.findByPk(id);
  if (!empleado) {
    return res.status(404).json({ mensaje: 'Empleado no encontrado.' });
  }

  req.empleado = empleado;
  next();
});

router.get('/', async (req, res) => {
  const empleados = await Empleado.findAll();
  res.json(empleados);
});

router.get('/:id', (req, res) => {
  res.json(req.empleado);
});

router.post('/', async (req, res) => {
  const error = validarDatos(req.body, true);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const empleado = await Empleado.create(req.body);
  res.status(201).json(empleado);
});

router.put('/:id', async (req, res) => {
  const error = validarDatos(req.body, false);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  await req.empleado.update(req.body);
  res.json(req.empleado);
});

router.delete('/:id', async (req, res) => {
  await req.empleado.update({ activo: false });
  res.json(req.empleado);
});

module.exports = router;
