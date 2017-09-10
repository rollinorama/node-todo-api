const jwt = require('jsonwebtoken');

// var data = {
//     id: 10
// }

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decode = jwt.verify(token, '123abc');
// console.log('Decode:', decode);




let user = {
    _id: 123,
    email: {
        type: String,
        minlength: 1,
        require: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
};
let access = 'auth';
let token = jwt.sign({ _id: user._id, access }, 'abc123').toString();
console.log('user:', user);

let userWithToken = Object.assign(user, { tokens: [{ access, token }] });
console.log('userWithToken:', userWithToken);

user.tokens.push({ access, token });
console.log('user again:', user);
