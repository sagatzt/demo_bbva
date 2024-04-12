const express = require('express')

const bodyParser = require('body-parser')
const app = express()
const port = 80
const cors = require('cors')

let usersConnected=0
let totalWatts=0
const maxPower=7400

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//SOCKETS
const server = require("http").Server(app)
const io = require("socket.io")(server)


io.on('connection', (socket) => {
  usersConnected++
  let randomName=getRandomName()
  console.log(`a new user connected (${randomName}). Total users: ${usersConnected}`)
  socket.emit('newPlayer', {
    totalWatts:totalWatts,
    usersConnected: usersConnected,
  })  
})


//API
app.get('/charge', (req, res) => {
  res.json({response:`totalWatts: ${totalWatts}`})
})

app.post('/add', (req, res) => {
  let response=req.body
  if(totalWatts<maxPower) totalWatts+=parseInt(response.watts)
  totalWatts=parseFloat(totalWatts.toFixed(2))
  response.totalWatts=totalWatts
  response.maxPower=maxPower
  response.date=formatDate(new Date())
  if(response['randomName']==undefined) response['randomName']=getRandomName()

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
  if(totalWatts>=100) totalWatts-=10
  io.sockets.emit('stats', {
    totalWatts:parseFloat(totalWatts.toFixed(2)),
    usersConnected: usersConnected,

  }) 
},100)

function formatDate(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  hours = hours % 12
  hours = hours ? hours : 12 
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  var strTime = hours + ':' + minutes + ':' + seconds
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + strTime
}

function getRandomName(){
	var firstnames = [["Jabalí","Toro","Perro","Boquerón","Tiburón","Loro","Gato","Canguro","Ratón","Serpiente","Elefante","Conejo","Burro","Tigre","Jilguero","Avestruz","Lagarto"],["Vaca","Tortuga","Sardina","Oruga","Rata","Cacatua","Gata","Hormiga","Ballena","Mariposa","Trucha","Cobaya","Mula","Avestruz","Lagartija"]]
	var lastnames= [["Miedoso","Aventurero","Apaleado","Ansiosa","Retorcido","Contento","Adormilado","Feliz","Furioso","Resabiado","Rápido","Resfriado","Loco","Cojo","Lento","Tragón"],["Miedosa","Aventurera","Apaleada","Ansiosa","Retorcida","Contenta","Adormilada","Feliz","Furiosa","Resabiada","Rápida","Resfriada","Loca","Coja","Lenta","Tragona"]]
  let i=Math.floor(Math.random()*10) % 2
  var rand_first = Math.floor(Math.random()*firstnames[i].length)
	var rand_last = Math.floor(Math.random()*lastnames[i].length)
  return `${firstnames[i][rand_first]} ${lastnames[i][rand_last]}`
}


