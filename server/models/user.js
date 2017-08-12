var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 1,
        require: true,
        trim: true
    },
    password: {
        type: String,
        default: 'teste123'
    }
})

const User = mongoose.model('User', userSchema);

module.exports = { User };