const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch')
const path = require('path')

const url = "https://jsonplaceholder.typicode.com"

// set the template engine as pug
app.set('view engine', 'pug')

// set the views directory
app.set('views', path.join(__dirname, 'views'))

// set the static file
app.use('/static', express.static('static'))

const fetch_todos = async () => {

    const response = await fetch(url + '/todos')
    const data = await response.json();
    return data;
}
const fetch_user = async (id) => {
    const response = await fetch(url + `/users/${id}`)
    const data = await response.json();
    return data;
}


app.get('/', (req, res) => {
    res.status(200)
    res.render('index')
})

app.get('/todos', async (req, res) => {
    let todos = await fetch_todos()

    todos = todos.map(e => {
        const { id, title, completed } = e
        return { id, title, completed }
    })
    res.json(todos)
})

app.get('/user/:id', async (req, res) => {
    const { id } = req.params
    const user = await fetch_user(id)
    let todos = await fetch_todos()

    // select todos according to id
    todos = todos.filter(e => e.userId === parseInt(id))

    //proper arrange of order according to predefined response
    todos = todos.map(todo => {
        const {id,title,userId,completed} = todo
        return {id,title,userId,completed}
    })

    const {name,email,phone} = user
    const uid = user.id //different because id is already defined above
    const json = {id:uid,name,email,phone,todos}

    res.json(json)
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
