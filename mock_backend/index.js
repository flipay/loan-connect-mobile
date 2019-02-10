const jsonServer = require('json-server')
var bodyParser = require('body-parser');
const server = jsonServer.create()
const router = jsonServer.router('db.json')

const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

server.get('/', function (req, res) {
  res.send('suck main')
})

server.get('/test', function (req, res) {
  res.send('Hello World')
})

server.post('/sign_up', (req, res) => {
  res.jsonp({ user: { 
    id: '222222' 
  }})
})

server.post('/accounts/:account_id/verify', (req, res) => {
  if (req.body && req.body.otp_number === '555555') {
    res.jsonp({ user: { 
      id: '222222' 
    }})
  } else {
    res.sendStatus(500)
  }
})

server.post('/accounts/:account_id/create_pin', (req, res) => {
  res.sendStatus(200)
})

server.post('/log_in', (req, res) => {
  if (req.body && req.body.pin === '5555') {
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})


server.use(router)

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("App is running on port " + port);
})