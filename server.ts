import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { initializeSocket } from './server/socket'
import cors from 'cors'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req, res) => {
        // Configurar CORS
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        // Manejar preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200)
            res.end()
            return
        }

        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
    })

    // Inicializar Socket.io
    initializeSocket(server)

    server.listen(3000, () => {
        console.log('> Ready on http://localhost:3000')
    })
})