if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");//here we have required the Listing table 
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const ExpressError = require("./utils/ExpressError.js"); this is causing Error in my file due to Express version
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review");//here we have required the Review table

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//this is done to use public folder which will serve static files

const store = MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",(error)=>{
    console.log("Error is Mongo Session Store:",error)
});

const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // httpOnly is generally used for security purposes which is "cross scripting attacks"
    }
}

// app.get("/", (req, res) => {
//     res.send("Hi, I am Root");
// })





app.use(session(sessionOptions));
app.use(flash());// flash will be used after the session only okay and also before Routes


//passport-local should be used only after session is declared because in 1 sesssion username and password should be saved
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//for connection to dataBase
main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);//myWanderlust is the DB name
}

//listen port first 
app.listen(5555, () => {
    console.log("app is listening to Port 5555");
})




app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email:"test@gmail.com",
        username:"test-user"
    });

    let registerUser = await User.register(fakeUser,"helloworld");
    res.send(registerUser);
})

app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter); //const router = expresss.Router({mergeParams:true});--> this line we have use that is mergeParams : true so that "id" gets passed to the child router
app.use("/",userRouter);







// These 2 both are related to ExpressError so dont use bvz my code is causing error due to some library of Express and its version in my code
// app.all("/*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.use((req, res) => { 
    res.render("listings/pageNotFound.ejs"); 
})