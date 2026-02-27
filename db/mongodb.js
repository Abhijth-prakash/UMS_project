const mongoose = require('mongoose')

const connection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/USERMANAGMENTSYSTEM')

        console.log('MongoDB connected')

    } catch (error) {
        console.log(' MongoDB connection error:', error.message)
    }
}

module.exports = {
    connection
}