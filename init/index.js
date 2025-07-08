const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing")


//for connection to dataBase
main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/myWanderlust");//myWanderlust is the DB name
}

const init = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6860feb03903f8f2cac975af"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

init();