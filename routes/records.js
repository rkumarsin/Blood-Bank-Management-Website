const express= require('express');
const router=express.Router();
const catchAsync =require('../utils/catchAsync');
const ExpressError= require('../utils/ExpressError');
const Record = require('../models/record');
const {isLoggedIn}=require('../middleware');

router.get('/', catchAsync(async (req, res) => {

    const records = await Record.find({});
    res.render('records/index', { records })
}));
router.get('/new', isLoggedIn,(req, res) => {
   
    res.render('records/new');
})

router.post('/', isLoggedIn,catchAsync(async (req, res, next) => {
 
    const record = new Record(req.body.record);
    await record.save();
    req.flash('success','Successfully made a new Record');
    res.redirect(`/records/${record._id}`)
    
}))

router.get('/:id', catchAsync(async (req, res) => {
    const record = await Record.findById(req.params.id)
    if(!record){
        req.flash('error','Record not found!');
        return res.redirect('/records');
    }
    res.render('records/show', { record });
}));



router.get('/:id/edit', isLoggedIn,catchAsync(async (req, res) => {
    const record = await Record.findById(req.params.id);
    res.render('records/edit', { record });
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const record = await Record.findByIdAndUpdate(id, { ...req.body.record });
    req.flash('success','Successfully updated records!');
    res.redirect(`/records/${record._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Record.findByIdAndDelete(id);
    req.flash('success','Successfully deleted record')
    res.redirect('/records');
}));

module.exports=router;
