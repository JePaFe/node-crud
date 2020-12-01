const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const port = process.env.PORT || 3000

const flash = require('express-flash')
app.use(flash())

const session = require('express-session')
app.use(session({
    secret: 'Secreto',
    resave: false,
    saveUninitialized: false
}))

const passport = require('passport')

require('./passport')

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({extended: false}))

app.engine('.hbs', exphbs())
app.set('view engine', '.hbs')

app.use(require('./routes'))
app.use(require('./routes/auth'))

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

//connection.end()