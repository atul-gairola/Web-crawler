const mongoose = require('mongoose');
const scraper = require('./scraper.js');

mongoose.connect('mongodb+srv://admin-atul:newpassword@cluster0-ymx8s.mongodb.net/betaListData?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

let Schema = mongoose.Schema;

let dataSchema = new Schema({
    industryName: String,
    startupsData: [{
        name: String,
        pitch: String,
        description: String,
        siteLink: String,
        makers: [String]
    }]
})

let DataModel = mongoose.model('betaListData', dataSchema);

const storingData = async () => {
const data = await scraper();
data.forEach(cur => {
 const doc = new DataModel(cur);
 doc.save((err) => {
   if(err)
   console.log(err);
   else(err)
   console.log('doc added');
 }) 
})
}

storingData();

