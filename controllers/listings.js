const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
    req.flash("error","Listing You are trying to access doesn't exists.");
    return res.redirect("/listings");}
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);

        //we need to check for individual items also whether they are send when requested from Hopscothch because my web page has a valid form where fields are "required" but Hopscotch will make a direct request without having a form so in that case form will automatically get submitted without checking whether individual fields have been sent or not .. so that is why this below checking are done but it may be many if else statment so we will use joi
    // if(!req.body.listing.title){
    //     throw new ExpressError(400,"Title is missing");
    // }
    // if(!req.body.listing.description){
    //     throw new ExpressError(400,"Description is missing");
    // }
    // if(!req.body.listing.location){
    //     throw new ExpressError(400,"Location is missing");
    // }
    //use joi instead of writing many statemnt sof if else individually
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","New Listing Created !");
        res.redirect("/listings");

}



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
    req.flash("error","Listing You are trying to access doesn't exists.");
    return res.redirect("/listings");
}
    req.flash("success","Listing Edited Sucessfully !");
    let originalImage = listing.image.url.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing,originalImage });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated Sucessfully !");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;//we have to first to url encoded okay to use this 
    await Listing.findByIdAndDelete(id);
    req.flash("error","Oops! Listing is Deleted.");
    res.redirect("/listings");
}