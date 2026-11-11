const mongoose = require('mongoose');

async function conectarMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta configurar MONGODB_URI en .env.');
  }

  await mongoose.connect(uri, {
    dbName: 'pedidos_db',
    serverSelectionTimeoutMS: 5000,
  });
  await mongoose.connection.db.command({ ping: 1 });
}

module.exports = conectarMongoDB;
