const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastLeft: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;