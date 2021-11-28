const express=require('express');
const User = require('../models/user');
const router=express.Router();
const passport=require('passport');
const catchAsync=require('../utils/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register');
});

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
    const {email,username,password}=req.body;
   const user=new User({email,username});
   const registeredUser=await User.register(user,password);
   req.login(registeredUser,err =>{
    if(err) return next(err);
    req.flash('success','Welcome to Blood Bank System');
    res.redirect('/records');
   })
    
} catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
    
})
router.post('/login',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req,res)=>{
req.flash('success','welcome back!');
const redirectUrl=req.session.returnTo || '/records';
delete req.session.returnTo;
res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success',"GoodBye!");
    res.redirect('/records');
})

module.exports=router;