const express = require('express')
const app = express()
const port = 80
const cors = require('cors')

let panels=0

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.json({response:`panels: ${panels}`})
})

app.get('/add', (req, res) => {
  panels++;
  res.json({response:`(add) panels: ${panels}`})
})

app.get('/reset', (req, res) => {
  panels=0
  res.json({response:`(reset) panels: ${panels}`})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

