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
  if(totalWatts<12500) totalWatts+=parseInt(response.watts)
  totalWatts=parseFloat(totalWatts.toFixed(2))
  response.totalWatts=totalWatts
  response.date=formatDate(new Date())
  io.sockets.emit("messages", response)
  res.json(response)
})

app.get('/reset', (req, res) => {
  totalWatts=0
  res.json({response:`(reset) totalWatts: ${totalWatts}`})
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



setInterval(()=>{
  if(totalWatts>=100) totalWatts-=100
  io.sockets.emit('messages', {
    totalWatts:parseFloat(totalWatts.toFixed(2))
  }) 
},2000)

function formatDate(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  //var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + strTime
}



