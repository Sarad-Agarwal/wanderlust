const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const User = require("./user.js")


//listingSchema is nothing but like a TABLE in SQL 
const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
        // type:String,
        // default:"https://wallpaperaccess.com/full/902489.jpg",
        // set:(v)=>v===""?"https://wallpaperaccess.com/full/902489.jpg":v,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
}
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;