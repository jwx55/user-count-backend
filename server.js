const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())

let activeUsers = 0
let lastUpdated = Date.now()

io.on('connection', socket => {
  activeUsers++
  lastUpdated = Date.now()
  io.emit('usercount', { activeUsers })

  socket.on('disconnect', () => {
    activeUsers = Math.max(activeUsers - 1, 0)
    lastUpdated = Date.now()
    io.emit('usercount', { activeUsers })
  })
})

app.get('/active-users', (req, res) => {
  res.json({ activeUsers, lastUpdated })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
