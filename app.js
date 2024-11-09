document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orden-formulario');
  const listaOrdenes = document.getElementById('ordenes-lista');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cliente = document.getElementById('cliente').value;
    const patente = document.getElementById('patente').value;
    const camion = document.getElementById('camion').value;
    const trabajo = document.getElementById('trabajo').value;
    const precio = document.getElementById('precio').value;

    const orden = { cliente, patente, camion, trabajo, precio };

    try {
      const response = await fetch('/api/orden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orden),
      });

      if (response.ok) {
        alert('Orden creada con éxito');
        form.reset();
        obtenerOrdenes();
      } else {
        alert('Error al crear la orden');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  });

  const obtenerOrdenes = async () => {
    try {
      const response = await fetch('/api/ordenes');
      const ordenes = await response.json();

      listaOrdenes.innerHTML = '';
      ordenes.forEach((orden) => {
        const ordenDiv = document.createElement('div');
        ordenDiv.classList.add('orden');

        ordenDiv.innerHTML = `
          <h3>${orden.cliente}</h3>
          <p><strong>Patente:</strong> ${orden.patente}</p>
          <p><strong>Camión:</strong> ${orden.camion}</p>
          <p><strong>Trabajo:</strong> ${orden.trabajo}</p>
          <p><strong>Precio:</strong> $${orden.precio}</p>
        `;

        listaOrdenes.appendChild(ordenDiv);
      });
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  obtenerOrdenes();
});
