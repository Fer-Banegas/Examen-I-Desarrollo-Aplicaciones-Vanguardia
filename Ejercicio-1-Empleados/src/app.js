const express = require('express');
const { ValidationError } = require('sequelize');
const sequelize = require('./config/database');
const Empleado = require('./models/Empleado');
const empleadosRouter = require('./routes/empleados');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use('/empleados', empleadosRouter);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({ mensaje: error.errors[0]?.message || 'Datos inválidos.' });
  }

  if (error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ mensaje: 'El cuerpo de la solicitud no es válido.' });
  }

  console.error('Error procesando la solicitud:', error.original?.code || error.name);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await Empleado.sync();
    console.log('MySQL conectado y tabla empleados disponible.');
  } catch (error) {
    const codigo = error.original?.code || error.name;
    console.error(`No se pudo preparar la base de datos (${codigo}). Revisa la configuración de MySQL en .env.`);
    await sequelize.close();
    process.exitCode = 1;
    return;
  }

  const server = app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${server.address().port}`);
  });
}

iniciarServidor();
