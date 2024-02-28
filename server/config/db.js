const mongoose = require('mongoose')
const colors = require('colors')
const connectDB = async () => {

try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(` connected ${mongoose.connection.host} `.bgMagenta)
} catch (error) {
    console.log(` error ${error} `.bgMagenta)
}

}

module.exports = connectDB