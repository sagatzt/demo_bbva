const express = require('express')

const bodyParser = require('body-parser')
const app = express()
const port = 80
const cors = require('cors')

let totalWatts=0

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//SOCKETS
const server = require("http").Server(app)
const io = require("socket.io")(server)


io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('messages', {totalWatts:totalWatts})  
})


//API
app.get('/charge', (req, res) => {
  res.json({response:`totalWatts: ${totalWatts}`})
})

app.post('/add', (req, res) => {
  const response=req.body
  totalWatts+=(parseInt(response.watts)/100)
  response.totalWatts=totalWatts
  
  io.sockets.emit("messages", {totalWatts:totalWatts})
  res.json(response)
})

app.get('/reset', (req, res) => {
  totalWatts=0
  res.json({response:`(reset) totalWatts: ${totalWatts}`})
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

