const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

// Conexión con MongoDB
const uri = "mongodb+srv://isma:isma@cluster0.tgxly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

// Ruta para obtener todas las órdenes
app.get('/api/ordenes', async (req, res) => {
  try {
    const ordenes = await collection.find().toArray();
    res.json(ordenes);
  } catch (error) {
    res.status(500).send('Error al obtener las órdenes');
  }
});

// Ruta para crear una nueva orden
app.post('/api/orden', async (req, res) => {
  try {
    const nuevaOrden = req.body;
    await collection.insertOne(nuevaOrden);
    res.status(201).send('Orden creada');
  } catch (error) {
    res.status(500).send('Error al crear la orden');
  }
});

// Ruta para editar una orden
app.put('/api/orden/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const actualizacion = req.body;
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: actualizacion });
    res.send('Orden actualizada');
  } catch (error) {
    res.status(500).send('Error al actualizar la orden');
  }
});

// Ruta para borrar una orden
app.delete('/api/orden/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.send('Orden eliminada');
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    res.status(500).send('Error al eliminar la orden');
  }
});

module.exports = app;
