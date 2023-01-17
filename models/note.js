const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

const connectDB = async () => {
    console.log("connecting to", url)
    mongoose.connect(url)
        .then((result) => console.log("connected to MongoDB"))
        .catch((error) => {
            console.error("error connecting to MongoDB:", error.message)
            process.exit(1)
        })
}

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports.Note = mongoose.model('Note', noteSchema)
module.exports.connectDB = connectDB
