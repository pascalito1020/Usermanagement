const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

const USERS = [{id: 0, input: "Wash dishes"}, {id: 1, input: "Talk a walk"}, {id: 2, input: "Prepare meal for tomorrow"}]

// ROUTES FOR Weather, Tasks, Login

router.get('/getuserid', (req, res) =>{
    res.json({
        username: req.session.username
    })

})

router.get('/weather', (req, res) => {
    res.render('weather')
})

router.get('/loginpage', (req, res) => {

    res.render('login')

})

router.post('/login', userController.login)

router.get('/notes', (req, res) =>{
    res.render("todo")
})

router.get('/getnotes', (req, res) =>{
    res.json(USERS)
})

router.post('/postnotes', (req, res) =>{
    try{
        const newUser = req.body
        const find = USERS.find (i => newUser.input === i.input ? i : '')
        if(find) {
            res.status(404 ).json({
                success: false,
                error: 'no'
            })
        }else{
        for(let i = 0; i < (USERS.length+1); i++) {
            if (USERS[i] === undefined) {
                USERS.push(Object.assign({id: i, input: req.body.input}))
                break;
            }
        }
        }
        console.log(USERS)
        res.json({
            success: true
        })
    }catch(e) {
        console.log(e)
        res.json({
            success: false
        })
    }
})

router.delete('/deletenotes/:id', (req, res) =>{

    const found = USERS.findIndex(i => parseInt(req.params.id) === i.id ? i : '')
    if(found >= 0){
        USERS.splice(found, 1)
        res.json({
            success: true,
        })
    }else{
        console.log("Error, no user with ID")
    }

})

router.put('/putnotes/:id', (req, res) =>{

    const updUser = req.body
    const found = USERS.find(itm => itm.id === parseInt(req.params.id) ? itm : '')
    if(found !== undefined){
        if(updUser.input) {
            found.input = updUser.input
        }
        res.json({
            success: true
        })
    }
})

// ROUTES FOR DATABASE MY SQL (Only Usermanagement

router.get('/main', userController.view) // Anzeige der Userdaten

router.post('/search', userController.find) // F??r User suche

router.post('/adduser', userController.create) // F??r Daten ??bergabe

router.get('/adduser', userController.form) // F??r Anzeige des Forms

router.get('/edituser/:id', userController.edit) // Anzeige f??r Edit form

router.post('/edituser/:id', userController.update) // Update user query

router.get('/:id', userController.remove) // Remove User

module.exports = router;