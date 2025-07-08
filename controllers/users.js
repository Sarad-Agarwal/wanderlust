const User = require("../models/user");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    let registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
           return next(err);
        }
    req.flash("success","Welcome Dear :)");
    res.redirect("/listings");
    })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome Back to WanderLust!");
    if(!res.locals.redirectUrl){
        res.locals.redirectUrl = "/listings";
    }
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Logout Successfully");
        res.redirect("/listings");
    });
}