const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

const uri = "mongodb+srv://isma:isma@cluster0.tgxly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let collection;

client.connect()
  .then(() => {
    db = client.db("ordenes_trabajo");
    collection = db.collection("ordenes");
    console.log("Conectado a la base de datos MongoDB.");
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Sirve los archivos estáticos de la carpeta 'public'

// Ruta para servir la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener todas las órdenes desde la base de datos
app.get('/api/ordenes', async (req, res) => {
  try {
    const ordenes = await collection.find().toArray(); // Obtener todas las órdenes
    res.json(ordenes); // Responde con JSON
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).send("Error al obtener las órdenes");
  }
});

// Ruta para insertar una nueva orden en la base de datos
app.post('/api/orden', async (req, res) => {
  try {
    const ordenDeTrabajo = req.body;
    const resultado = await collection.insertOne(ordenDeTrabajo);
    
    res.json({ insertedId: resultado.insertedId });
  } catch (error) {
    console.error("Error al insertar la orden de trabajo:", error);
    res.status(500).send("Error al insertar la orden de trabajo");
  }
});

app.put('/api/orden/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ordenDeTrabajo = req.body;

    const resultado = await collection.updateOne(
      { _id: new MongoClient.ObjectId(id) },  // Convertir el id a ObjectId de MongoDB
      { $set: ordenDeTrabajo }  // Actualizar los campos con los datos recibidos
    );

    if (resultado.modifiedCount === 0) {
      return res.status(404).send("Orden no encontrada o no hubo cambios");
    }

    res.send("Orden actualizada con éxito");
  } catch (error) {
    console.error("Error al actualizar la orden de trabajo:", error);
    res.status(500).send("Error al actualizar la orden de trabajo");
  }
});

// Ruta para eliminar una orden de trabajo
app.delete('/api/orden/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).send("Orden no encontrada");
    }

    res.send("Orden eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar la orden de trabajo:", error);
    res.status(500).send("Error al eliminar la orden de trabajo");
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
