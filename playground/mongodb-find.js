const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err)
        return console.log('Unable to connect to MongoDB server');

    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({_id: new ObjectID('5985cb424b38bf1ecff2cffd')}).toArray().then(docs => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, err => {
    //     console.log('Unable to fetch Todos')
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, err => {
    //     console.log('Unable to fetch Todos')
    // });

    db.collection('Users').find({ name: 'Rollin' }).toArray().then(docs => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, err => {
        console.log('Unable to fetch Users')
    });

    db.collection('Users').find({ name: 'Rollin' }).count().then(count => {
        console.log(`Count: ${count}`)
    }, err => {
        console.log('Unable to fetch Users');
    });

    db.close();
})