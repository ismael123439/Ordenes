const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors());

// Conexión con MongoDB usando la variable de entorno para la URI
const uri = process.env.MONGODB_URI || "mongodb+srv://isma:isma@cluster0.tgxly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db, collection;

client.connect()
  .then(() => {
    db = client.db("ordenes_trabajo");
    collection = db.collection("ordenes");
    console.log("Conectado a la base de datos MongoDB.");
  })
  .catch(err => console.error(err));

app.use(express.json());
app.use(express.static('public')); // Sirve los archivos estáticos como el HTML

// Ruta para obtener todas las órdenes
app.get('/ordenes', async (req, res) => {
  try {
    const ordenes = await collection.find().toArray();
    res.json(ordenes);  // Asegúrate de que la respuesta sea JSON
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

// Ruta para crear una nueva orden
app.post('/orden', async (req, res) => {
  try {
    const nuevaOrden = req.body;
    await collection.insertOne(nuevaOrden);
    res.status(201).json({ message: 'Orden creada' });  // Respuesta JSON
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// Ruta para editar una orden
app.put('/orden/:id', async (req, res) => {
  const { id } = req.params;
  const actualizacion = req.body;
  try {
    await collection.updateOne({ _id: new MongoClient.ObjectId(id) }, { $set: actualizacion });
    res.json({ message: 'Orden actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
});

// Ruta para borrar una orden
app.delete('/orden/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Orden eliminada' });
    } else {
      res.status(404).json({ error: 'Orden no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
