const express = require('express')

const app = express()
const port = 80
const cors = require('cors')

let panels=0

app.use(cors())
app.use(express.static('public'))


//SOCKETS
const server = require("http").Server(app)
const io = require("socket.io")(server)


io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('messages', {panels:panels})  
})


//API
app.get('/panels', (req, res) => {
  res.json({response:`panels: ${panels}`})
})

app.get('/add', (req, res) => {
  panels++;
  io.sockets.emit("messages", {panels:panels})
  res.json({response:`(add) panels: ${panels}`})
})

app.get('/reset', (req, res) => {
  panels=0
  res.json({response:`(reset) panels: ${panels}`})
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

