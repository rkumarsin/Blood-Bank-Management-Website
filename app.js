const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync =require('./utils/catchAsync');
const ExpressError= require('./utils/ExpressError');
const session=require('express-session');
const flash= require('connect-flash');
const methodOverride = require('method-override');
const passport=require('passport');
const LocalStrategy = require('passport-local');
const Record = require('./models/record');
const User=require('./models/user');

const userRoutes=require('./routes/users');
const recordRoutes=require('./routes/records');

mongoose.connect('mongodb://localhost:27017/blood-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.log.bind(console, "conection error:"));
db.once("open", () => {
    console.log("Databse connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig={
    secret: 'thisshouldbe',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req,session)
    res.locals.currentUser=req.user;
   res.locals.success= req.flash('success');
   res.locals.error=req.flash('error');
   next();
})

app.use('/',userRoutes);
app.use('/records', recordRoutes)

app.get('/', (req, res) => {
    res.render('home')
});




app.all('*',(req,res,next) =>{
    next(new ExpressError('Page Not Found', 404))
})
app.use((err,req,res,next)=> {
    const{ statusCode=500, message='Something went wrong!'}= err;
    res.status(statusCode).send(message);
})
app.listen(3000, () => {
    console.log("App is listening!")
})