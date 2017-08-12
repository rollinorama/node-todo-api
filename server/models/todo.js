var mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

if(process.env.NODE_ENV === 'test'){
    var Todo = mongoose.model('TodoTest', todoSchema); 
} else {
    var Todo = mongoose.model('Todo', todoSchema);
}


module.exports = {Todo};