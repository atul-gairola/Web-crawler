require('dotenv').config()
const mongoose = require('mongoose');

// connecting to the remote database
mongoose.connect(`mongodb+srv://admin-atul:${process.env.DB_PASS}@cluster0-ymx8s.mongodb.net/betaListData?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

let db = mongoose.connection;

// error while connecting to db  
db.on("error", console.error.bind(console, "connection error:"));

// on successful connection
db.once("open", function() {
  console.log("Connection Successful!");
});

let Schema = mongoose.Schema;

// Schema
let dataSchema = new Schema({
    industryName: String,
    startupData: {
        name: String,
        pitch: String,
        description: String,
        siteLink: String,
        makers: [String]
    }
})

// Exporting Schema model 
module.exports = mongoose.model('betaListData', dataSchema);
