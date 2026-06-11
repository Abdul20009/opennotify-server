require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const notificationRoutes = require('./routes/notifications')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

// Attach io to every request so routes can use it
app.use((req, res, next) => {
  req.io = io
  next()
})

// This runs every time someone connects
io.on('connection', (socket) => {
  console.log('Someone connected:', socket.id)

  // User tells us who they are
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`${userId} is now listening for notifications`)
  })

  socket.on('disconnect', () => {
    console.log('Someone disconnected:', socket.id)
  })
})

app.get('/', (req, res) => {
  res.json({ message: 'OpenNotify server running' })
})

app.use('/notifications', notificationRoutes)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`OpenNotify running on port ${PORT}`)
})