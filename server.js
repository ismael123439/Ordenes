const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

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

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta "public"

// Ruta para cargar órdenes
app.post('/api/orden', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("miNuevaBaseDeDatos");
    const collection = db.collection("miNuevaColeccion");

    const ordenDeTrabajo = req.body;
    const resultado = await collection.insertOne(ordenDeTrabajo);
    
    res.json({ insertedId: resultado.insertedId });
  } catch (error) {
    console.error("Error al insertar la orden de trabajo:", error);
    res.status(500).send("Error al insertar la orden de trabajo");
  } finally {
    await client.close();
  }
});

// Ruta para obtener todas las órdenes
app.get('/api/ordenes', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("miNuevaBaseDeDatos");
        const collection = db.collection("miNuevaColeccion");

        const ordenes = await collection.find({}).toArray();
        res.json(ordenes);
    } catch (error) {
        console.error("Error al obtener las órdenes de trabajo:", error);
        res.status(500).send("Error al obtener las órdenes de trabajo");
    } finally {
        await client.close();
    }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
