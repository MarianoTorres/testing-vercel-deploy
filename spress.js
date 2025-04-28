import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración del entorno
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3000

// Creamos una instancia de Express
const app = express()

// Middleware para servir archivos estáticos desde la carpeta 'public'
// app.use(express.static(path.join(__dirname, "public")))

// Ruta específica para la página principal
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "public", "index.html"))
  res.send("<h1>Hola Mundo, pero desde mi nuevo hosting</h1>")
})

// Ruta para manejar 404 - Página no encontrada
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"))
})

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express ejecutándose en http://localhost:${PORT}`)
})