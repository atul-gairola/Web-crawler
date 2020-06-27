require('dotenv').config()
const mongoose = require('mongoose');

// link to the db
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@cluster0-ymx8s.mongodb.net/Startup_Listing?retryWrites=true&w=majority`;

// connecting to the remote database
mongoose.connect( dbUrl , {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

let db = mongoose.connection;

// error while connecting to db  
db.on("error", console.error.bind(console, "connection error:"));

// on successful connection
db.once("open", function() {
  console.log("Connection Successful! Connected to the Startup Listeng DB");
});

let Schema = mongoose.Schema;

// Market Schema
let marketSchema = new Schema({
    industryName: String,
    count: Number
});

// Startup Schema
let startupSchema = new Schema({
        name: String,
        industryName: String,
        images:[String],
        pitch: String,
        description: String,
        siteLink: String,
        socials:{
          twitter: String,
          facebook: String
        },
        makersDetails: [{
            avatar: String,
            name: String,
            role: String
        }]
});

// Exporting Market Schema model 
exports.MarketModel = mongoose.model('industry', marketSchema);

// Exporting Startup Schema model
exports.StartupModel = mongoose.model('startup', startupSchema);


