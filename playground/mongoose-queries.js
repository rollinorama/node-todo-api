const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { User } = require('../server/models/user');

const id = '59998abd5cbd63d6598f152f';

if (!ObjectID.isValid(id)) {
    console.log('Id is not valid');
}

// User.find({
//     _id: id
// }).then(result => {
//     console.log('Find id is', result)
// });

// User.findOne({
//     _id: id
// }).then(result => {
//     console.log('findOne result', result)
// });

User.findById(id).then(result => {
    if (!result) return console.log('cant find id');
    console.log('findById', result)
}).catch(err => console.log(err));