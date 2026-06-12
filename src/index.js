require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const notificationRoutes = require('./routes/notifications')
const redis = require('./lib/redis')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  req.io = io
  next()
})

io.on('connection', (socket) => {
  console.log('Someone connected:', socket.id)

  socket.on('join', async (userId) => {
    // Join the Socket.io room
    socket.join(userId)

    // Store in Redis: this user is online
    // TTL of 300 seconds (5 minutes) — auto expires if they disconnect without telling us
    await redis.set(`online:${userId}`, socket.id, { ex: 300 })

    console.log(`${userId} is online`)
  })

  socket.on('disconnect', async () => {
    // Find which userId this socket belonged to and remove from Redis
    const keys = await redis.keys('online:*')
    for (const key of keys) {
      const storedSocketId = await redis.get(key)
      if (storedSocketId === socket.id) {
        await redis.del(key)
        const userId = key.replace('online:', '')
        console.log(`${userId} went offline`)
        break
      }
    }
  })
})

app.get('/', (req, res) => {
  res.json({ message: 'OpenNotify server running' })
})

// New route — check if a user is online
app.get('/presence/:userId', async (req, res) => {
  const socketId = await redis.get(`online:${req.params.userId}`)
  res.json({ 
    userId: req.params.userId,
    online: !!socketId 
  })
})

app.use('/notifications', notificationRoutes)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`OpenNotify running on port ${PORT}`)
})