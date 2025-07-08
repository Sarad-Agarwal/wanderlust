const expresss = require("express");
const router = expresss.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing))

router.get("/new", isLoggedIn,listingController.renderNewForm)

router.route("/:id")
      .get(wrapAsync(listingController.showListing))
      .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
      .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))


//Show all listings - Index Route
// router.get("/", wrapAsync(listingController.index));


//Create New Listing
// router.get("/new", isLoggedIn,listingController.renderNewForm)


//Show Route 
// router.get("/:id",wrapAsync(listingController.showListing));


//Post request on listings
// router.post("/",isLoggedIn,validateListing ,wrapAsync(listingController.createListing))

//Edit listing Route
router.get("/:id/edit",isLoggedIn ,isOwner,wrapAsync(listingController.renderEditForm))

//Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

//Delete Route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))


module.exports = router;