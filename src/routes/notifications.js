const express = require('express')
const router = express.Router()
const pool = require('../lib/db')

router.get('/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  const { appId, userId, title, body, data } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO notifications (app_id, user_id, title, body, data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [appId, userId, title, body, data || null]
    )
    const notification = result.rows[0]

    // ← THIS is the new line. Deliver instantly to that user's room
    req.io.to(userId).emit('notification', notification)

    res.json(notification)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/:id/read', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *',
      [req.params.id]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router