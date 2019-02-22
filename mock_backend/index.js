const jsonServer = require('json-server')
var bodyParser = require('body-parser');
const server = jsonServer.create()
const router = jsonServer.router('db.json')

const middlewares = jsonServer.defaults()

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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

server.get('/rates', (req, res) => {
  const { asset_give, asset_take } = req.query
  const asset = asset_give === 'THB' ? asset_take : asset_give
  let price = 0
  if (asset === 'BTC') {
    price = 121790 + getRandomInt(100) 
  } else if (asset === 'ETH') {
    price = 4485 + getRandomInt(10) 
  } else if (asset === 'OMG') {
    price = 39.77 + getRandomInt(2) 
  } 
  
  if (asset_give === 'THB') {   // Buy
    const { amount_give, amount_take } = req.query
    if (amount_give) {
      const amount = amount_give / price
      const saved_amount = amount_give / 1000
      res.jsonp({
        amount,
        saved_amount
      })
    } else if (amount_take) {
      const amount = amount_take * price
      const saved_amount = amount / 1000
      res.jsonp({
        amount,
        saved_amount
      })
    } else {
      res.sendStatus(500)
    }
  } else { // Sell
    const { amount_give, amount_take } = req.query
    if (amount_give) {
      const amount = amount_give * price
      const saved_amount = amount / 1000
      res.jsonp({
        amount,
        saved_amount
      })
    } else if (amount_take) {
      const amount = amount_take / price
      const saved_amount = amount_take / 1000
      res.jsonp({
        amount,
        saved_amount
      })
    } else {
      res.sendStatus(500)
    }
  }
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