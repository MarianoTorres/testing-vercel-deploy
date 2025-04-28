import http from "http"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000

const server = http.createServer((req, res) => {
    // Obtener URL Solicitada
    let filePath = "." + req.url

    //Si la URL es '/' se redirige a '/index.html'
    if (filePath === "./") {
        filePath = "./public/index.html"
    } else {
        filePath = "./public" + req.url
    }

    fs.readFile(path.join(__dirname, filePath), (err, content) => {
        if (err) {
            //Si el archivo no existe, devolvemos el 404
            if(err.code === "ENOENT") {
                fs.readFile(path.join(__dirname, "./public/404.html"), (err, content) => {
                    res.writeHead(404, { "Content-Type": "text/html" })
                    res.end(content, "utf-8")
                })
            } else {
                //Si hay otro error, devolvemos el 500
                res.writeHead(500)
                res.end("Error interno del servidor")
            }
        } else {
            res.writeHead(200, { "Content-Type": "text/html" })
            res.end(content, "utf-8")
        }
    })
})

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
