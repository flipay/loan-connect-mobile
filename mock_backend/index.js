const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)


server.post('/sign_up', (req, res) => {
  res.jsonp({ user: { 
    id: '222222' 
  }})
})

server.post('/account/:account_id/verify', (req, res) => {
  if (req.body && req.body.otp_number === '555555') {
    res.jsonp({ user: { 
      id: '222222' 
    }})
  } else {
    res.sendSatus(500)
  }
})

server.post('/account/:account_id/create_pin', (req, res) => {
  res.sendSatus(200)
})

server.use(router)



server.listen(3000, () => {
  console.log('JSON Server is running')
})
