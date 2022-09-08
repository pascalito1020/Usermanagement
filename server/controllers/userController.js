const mysql = require("mysql")

// Connection Pool

const pool = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user: 'root',
    password: '',
    database: 'usermanagement'
});

// View Users
exports.view = (req, res) => {

     pool.getConnection((err, connection) => {
         if(err){
             throw err
         }else {
             console.log("Connected to DB!");
             connection.query('SELECT * FROM user', (err, rows) =>{
                 connection.release();
                 if(!err){
                     res.render('home', {rows})
                     console.log(rows)
                 }else{
                     console.log("Fehler ;(")
                 }
             })
         }
     })
 }

 // Search User
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err){
            throw err
        }else {
            console.log("Connected to DB!");

            let searchTerm = req.body.search

            connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) =>{
                connection.release();
                if(!err){
                    res.render('home', {rows})

                }else{
                    console.log("Fehler ;(")
                }
            })
        }
    })


}

//View Add user Page
exports.form = (req, res) => {

     res.render('add-user')

}

// Create User
exports.create = (req, res) => {

    const {first_name, last_name, email, phone, comments} = req.body

    pool.getConnection((err, connection) => {
        if(err){
            throw err
        }else {
            console.log("Connected to DB!");
            connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',[first_name, last_name, email, phone, comments], (err, rows) =>{
                connection.release();
                if(!err){
                    res.render('add-user', {alert: 'User added!'})
                }else{
                    console.log(err)
                    console.log("Fehler ;(")
                }
            })
        }
    })


}


// Render Edit Page with Params from ID
exports.edit = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err){
            throw err
        }else {
            console.log("Connected to DB!");
            connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) =>{
                connection.release();
                if(!err){
                    res.render('edit-user', {rows})
                }else{
                    console.log("Fehler ;(")
                }
            })
        }
    })

}

//Update User
exports.update = (req, res) => {

    const {first_name, last_name, email, phone, comments} = req.body

    pool.getConnection((err, connection) => {
        if(err){
            throw err
        }else {
            console.log("Connected to DB!");
            connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',[first_name,last_name, email,phone, comments, req.params.id], (err, rows) =>{
                connection.release();
                if(!err){
                    pool.getConnection((err, connection) => {
                        if(err){
                            throw err
                        }else {
                            connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) =>{
                                connection.release();
                                if(!err){
                                    res.render('edit-user', {rows, alert: 'User edited!'})
                                }else{
                                    console.log("Fehler ;(")
                                }
                            })
                        }
                    })
                }else{
                    console.log("Fehler ;(")
                }
            })
        }
    })

}



// Remove user
exports.remove = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err){
            throw err
        }else {
            console.log("Connected to DB!");
            connection.query('DELETE FROM user WHERE id = ?',[req.params.id], (err, rows) =>{
                connection.release();
                if(!err){
                    res.redirect('/main')
                }else{
                    console.log("Fehler ;(")
                }
            })
        }
    })


}


//  Login User
exports.login = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if(username && password) {
        pool.getConnection((err, connection) => {
            if(err){
                throw err
            }else{
                console.log("Connected to DB!");
                connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (err, results, rows) =>{
                    if (err) {
                        throw err;
                    }
                    // If the account exists
                    if (results.length > 0) {
                        // Authenticate the user
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.save();
                        // Redirect to home page
                        res.redirect('/main')
                    } else {
                        res.send('Userdata not in database, try again')
                    }
                    res.end();
                })
            }
        })

    }else {
        res.send('Missing username or password')
        res.end();
    }
}