const { MongoClient, ObjectId } = require('mongodb');

// Configuración de la conexión a MongoDB
const uri = "mongodb+srv://isma:isma@cluster0.tgxly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let db, collection;

// Conectar a MongoDB y obtener la colección al inicio
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("ordenes_trabajo");
    collection = db.collection("ordenes");
    console.log("Conectado a MongoDB.");
  }
}

// Función para manejar las solicitudes
module.exports = async (req, res) => {
  await connectDB(); // Asegurarse de que la base de datos esté conectada

  if (req.method === 'GET') {
    // Obtener todas las órdenes
    const ordenes = await collection.find().toArray();
    res.status(200).json(ordenes);
  } else if (req.method === 'POST') {
    // Crear una nueva orden
    const nuevaOrden = req.body;
    await collection.insertOne(nuevaOrden);
    res.status(201).send('Orden creada');
  } else if (req.method === 'PUT') {
    // Editar una orden
    const { id } = req.query;
    const actualizacion = req.body;
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: actualizacion });
    res.status(200).send('Orden actualizada');
  } else if (req.method === 'DELETE') {
    // Borrar una orden
    const { id } = req.query;
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.status(200).send('Orden eliminada');
      } else {
        res.status(404).send('Orden no encontrada');
      }
    } catch (err) {
      res.status(500).send('Error al eliminar la orden');
    }
  } else {
    res.status(405).send('Método no permitido');
  }
};
