const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Ruta para procesar pagos referenciados usando la API
app.post('/api/payment', async (req, res) => {
  const { referencia, monto, descripcion, dueDate } = req.body;

  try {
    // Realizar la solicitud a la API de sandbox
    const response = await axios.post(
      `${process.env.SANDBOX_URL}/payments`,
      {
        referencia,
        monto,
        descripcion,
        dueDate,
      },
      {
        auth: {
          username: process.env.API_USERNAME,
          password: process.env.API_PASSWORD,
        },
      }
    );

    // Enviar la respuesta de la API al cliente
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al procesar el pago:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error al procesar el pago',
      details: error.response?.data || error.message,
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
