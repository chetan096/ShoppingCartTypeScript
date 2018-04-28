const express = require('express') // expess module
const path = require('path') // path module
const app = express() // server instance
const passport = require('./passport')
const session = require('express-session')

//make css folder static and accessible directly
app.use(express.static('public/css'))
app.use(express.static('public/view'))
app.use(express.static('public/images'))

//app.use(express.static('public'))
//make public folder inside current directory static
// app.use('/', (req, res, next) => {
//   express.static(path.join(__dirname, 'public'))
//   next()
// })
// create public a static website run index file by default
app.use(express.json()) // helps in sending json data
// helps in encoding url
app.use(express.urlencoded({
  extended: true
}))

//session attributes setting
app.use(session({
  secret: 'a secret key',
  resave: false,
  saveUninitialized: false
}))

//initializing passport and session
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control', 'no-cache'
  )
  next()
})

// if authentification fails redirect to the index.html otherwise redirect to show carts
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login.html',
  successRedirect: '/showProducts.html',

}))
// logout user and remove from session
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login.html')
})

app.use('/api', require('./routes/api')); // it will mount index.js on this path
//manage html files 
// if direct page request comes then it will first authenticate if not logged in redirect to login.html else open required file
app.use('/', (req, res, next) => {
  if (!req.user) {
    if (req.path == '/signup.html' || req.path == '/login.html'||req.path=='/error.html') {
      res.sendFile(req.path, { root: path.join(__dirname, 'public') })
      return
    }
    res.sendFile('/showProducts.html', { root: path.join(__dirname, 'public') })
  } else {

    if (req.path == '/' || req.path == "/login.html")
      res.sendFile('/showProducts.html', { root: path.join(__dirname, 'public') })
    else {
      if (req.path == "/signup.html" || req.path == "/showCart.html" || req.path == "/addProduct.html" || req.path == "/signup.html"||req.path == "/showProducts.html")
        res.sendFile(req.path, { root: path.join(__dirname, 'public') })
      else {
        res.sendFile('error.html', { root: path.join(__dirname, 'public') })
      }
    }

  }})



// listen on 8000 port number of local host
app.listen(8000)
