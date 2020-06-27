require('dotenv').config();
const mongoose = require('mongoose');

const scraper = require('./scraper');

// connecting to the remote database
mongoose.connect( `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0-ymx8s.mongodb.net/Startup_Listing?retryWrites=true&w=majority` , {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(
 () =>  console.log('Connected to the db')
)
.catch(
 err => console.log(err)
)


scraper();
