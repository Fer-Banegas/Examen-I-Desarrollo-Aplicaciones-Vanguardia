require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const conectarMongoDB = require('./config/database');
const pedidosRouter = require('./routes/pedidos');

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use('/pedidos', pedidosRouter);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const mensajes = Object.values(error.errors).map((detalle) => {
      return detalle.kind === 'required'
        ? `El campo ${detalle.path} es obligatorio.`
        : detalle.message;
    });
    return res.status(400).json({ mensaje: mensajes.join(' ') });
  }

  if (error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ mensaje: 'La solicitud no es válida.' });
  }

  console.error('Error al procesar la solicitud:', error.code || error.name);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

async function iniciarServidor() {
  try {
    await conectarMongoDB();
  } catch (error) {
    const mensaje = process.env.MONGODB_URI
      ? 'No se pudo conectar a MongoDB. Verifica el servicio local y la URI en .env.'
      : 'Falta configurar MONGODB_URI en .env.';
    console.error(`${mensaje} (${error.name})`);
    await mongoose.disconnect();
    process.exitCode = 1;
    return;
  }

  console.log('MongoDB conectado a pedidos_db.');
  const server = app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${server.address().port}`);
  });
}

iniciarServidor();
