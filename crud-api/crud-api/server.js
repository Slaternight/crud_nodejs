const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
// Servir archivos estáticos
app.use(express.static('public'));


// Middleware para permitir leer JSON en las solicitudes
app.use(express.json());

const filePath = './data.json';

// Función para leer los datos desde el archivo JSON
const readData = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Función para escribir datos en el archivo JSON
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Ruta GET para obtener todos los datos
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data);
});

// Ruta POST para agregar nuevos datos
app.post('/items', (req, res) => {
  const data = readData();
  const newItem = req.body;
  newItem.id = data.length ? data[data.length - 1].id + 1 : 1; // Generar ID único
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Ruta PUT para actualizar un dato existente
app.put('/items/:id', (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const index = data.findIndex(item => item.id === itemId);
  
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body }; // Actualizar el dato
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Item no encontrado' });
  }
});

// Ruta DELETE para eliminar un dato
app.delete('/items/:id', (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const filteredData = data.filter(item => item.id !== itemId);
  
  if (data.length !== filteredData.length) {
    writeData(filteredData);
    res.json({ message: 'Item eliminado' });
  } else {
    res.status(404).json({ message: 'Item no encontrado' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
