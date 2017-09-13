require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose.js');
var { Todo } = require('./models/todo.js');
var { User } = require('./models/user.js');
const Authenticate = require('./middleware/Authenticate');
const authenticate = new Authenticate;

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/** TODOS API **/
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed
    });
    todo.save().then(result => {
        res.send(result);
    }, err => {
        res.status(400).send(err);
    });
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, err => {
        res.status(400).send(err);
    });
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findById(id).then(todo => {
        if (!todo)
            return res.status(404).send();
        res.send({ todo });
    }, err => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id))
        return res.status(404).send();

    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo)
            return res.status(404).send();
        res.send(todo);
    }, err => res.status(400).send());
})

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id))
        return res.status(404).send();

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then(todo => {
        if (!todo)
            return res.status(404).send();
        res.send({ todo });
    }, err => res.status(400).send());
})
/** END TODOS **/

/** USERS API **/
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate.user, (req, res) => {
    res.send(req.user);
})
/** END USERS **/

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

module.exports = { app };