const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server.js');
const { Todo } = require('./../models/todo.js');

process.env.NODE_ENV = 'test';

describe('Todo API', () => {

    describe('/POST', () => {
        beforeEach(done => {
            Todo.remove({}).then(() => done());
        })
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

                    Todo.find().then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);

                        done();
                    }).catch(err => done(err));
                })
        })
        it('Should not create todo with invalid body data', done => {
            request(app)
                .post('/todos')
                .send({ text: ' ' })
                .expect(400)
                .end((err, res) => {
                    if (err)
                        return done(err);

                    Todo.find().then(todos => {
                        expect(todos.length).toBe(0);

                        done();
                    }).catch(err => done(err));
                })
        })
    })
})