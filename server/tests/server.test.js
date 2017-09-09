const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');

process.env.NODE_ENV = 'test';

const todos = [{
    _id: new ObjectID,
    text: 'First todo test'
}, {
    _id: new ObjectID,
    text: 'Second todo test',
    completed: true,
    completedAt: new Date().getTime()
}]

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos).then(() => done())
    });
})

describe('Todo API', () => {

    describe('POST /todos', () => {
        it('Should create new todo', done => {
            let text = 'Test';
            request(app)
                .post('/todos')
                .set('Accept', 'application/json')
                .send({ text })
                .expect(200)
                .expect(res => {
                    expect(res.body.text).toBe(text);
                })
                .end((err, res) => {
                    if (err)
                        return done(err);

                    Todo.find({ text }).then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);

                        done();
                    }).catch(err => done(err));
                })
        });
        it('Should not create todo with invalid body data', done => {
            request(app)
                .post('/todos')
                .send({ text: ' ' })
                .expect(400)
                .end((err, res) => {
                    if (err)
                        return done(err);

                    Todo.find().then(todos => {
                        expect(todos.length).toBe(2);

                        done();
                    }).catch(err => done(err));
                });
        });
    });

    describe('GET /todos', () => {
        it('Should get all todos', done => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect(res => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('Should get one todo by ID', done => {
            Todo.findOne({ text: 'First todo test' }).then(todo => {
                request(app)
                    .get(`/todos/${todo._id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.todo.text).toBe('First todo test');
                    })
                    .end(done);
            }, err => console.log(err));
        })
        it('Should get a 404 when get todo with valid but not existing id', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .get(`/todos/${id}`)
                .expect(404)
                .end(done);
        });
        it('Should get a 404 when get todo with wrong id', done => {
            const id = '123';
            request(app)
                .get(`/todos/${id}`)
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('Should delete one todo by ID', done => {
            let itemId = todos[1]._id.toHexString();
            request(app)
                .delete(`/todos/${itemId}`)
                .expect(200)
                .expect(res => {
                    expect(res.body._id).toBe(itemId);
                })
                .end((err, res) => {
                    if (err)
                        return done(err);

                    Todo.findById(itemId).then(todo => {
                        expect(todo).toNotExist();

                        done();
                    }).catch(err => done(err));
                });
        }, err => console.log(err));
        it('Should get a 404 when get todo with valid but not existing id', done => {
            const id = new ObjectID().toHexString;
            request(app)
                .delete(`/todos/${id}`)
                .expect(404)
                .end(done);
        });
        it('Should get a 404 when delete todo with wrong id', done => {
            const id = '123';
            request(app)
                .delete(`/todos/${id}`)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todos/:id', () => {
        it('Should update the todo', done => {
            const itemId = todos[0]._id.toHexString();
            const itemBody = {
                text: "PATCH Test",
                completed: true
            }
            request(app)
                .patch(`/todos/${itemId}`)
                .set('Accept', 'application/json')
                .send(itemBody)
                .expect(200)
                .expect(res => {
                    expect(res.body.todo.text).toBe(itemBody.text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                })
                .end(done);
        });
        it('Should clear completedAt when todo is not completed', done => {
            const itemId = todos[1]._id.toHexString();
            const itemBody = {
                text: "PATCH Test false",
                completed: false
            }
            request(app)
                .patch(`/todos/${itemId}`)
                .set('Accept', 'application/json')
                .send(itemBody)
                .expect(res => {
                    expect(res.body.todo.text).toBe(itemBody.text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        })
    });
});