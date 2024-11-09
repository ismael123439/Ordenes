// /api/orden.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://isma:isma@cluster0.tgxly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/orden') {
    // Ruta para insertar una nueva orden de trabajo
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

  } else if (req.method === 'GET' && req.url === '/api/ordenes') {
    // Ruta para obtener todas las órdenes
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

  } else {
    // Si la ruta no coincide, devuelve un 404
    res.status(404).send("Ruta no encontrada");
  }
};
