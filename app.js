const express = require("express");
const exhps = require("express-handlebars")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const routes = require('./server/routes/user');
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'views/layouts')));// Static Files

// Template Engine
app.engine('hbs', exhps.engine({ extname: '.hbs',
                                            defaultLayout: 'main'}));
app.set('view engine', 'hbs')

// Connection Pool

const pool = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user: 'root',
    password: '',
    database: 'usermanagement'
});

// Connect
pool.getConnection((err, connection) => {
    if(err){
        throw err
    }else {
        console.log("Connected to DB!");
    }
})

app.use('/', routes)

app.listen(port, () =>
    console.log("Listening on port " + port)
)