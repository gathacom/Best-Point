const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const ErrorHandler = require('../utils/ErrorHandler');
const {placeSchema} = require('../schemas/place');
const Place = require('../models/place');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');

const router = express.Router({mergeParams: true});

const validatePlace = (req, res, next) => {
    const {error} = placeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        return next(new ErrorHandler(msg, 400));
    }
    else{
        next();
    }
}

router.get('/', wrapAsync( async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places })
}));

router.get('/create', isAuth, (req, res) => {
    res.render('places/create')
})

router.post('/', isAuth, validatePlace, wrapAsync( async (req, res, next) => {
    const {place} = req.body
    const newPlace = new Place(place);
    await newPlace.save(); 
    req.flash('success_msg','Successfully made a new place!');
    res.redirect('/places');
}))

router.get('/:id',isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id).populate('reviews');
    res.render('places/show', { place })
}))

router.get('/:id/edit', isAuth, isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id);
    console.log(place);
    res.render('places/edit', { place })
}))

router.put('/:id', isAuth, isValidObjectId('/places'),isValidObjectId('/places'), validatePlace, wrapAsync(async (req, res) => {
    const {place} = req.body;
    const {id} = req.params;
    await Place.findByIdAndUpdate(id, {...place});
    req.flash('success_msg','Successfully updated place!');
    res.redirect(`/places/${id}`)
}))

router.delete('/:id',isAuth, isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Place.findByIdAndDelete(id);
    req.flash('success_msg','Successfully deleted place!');
    res.redirect('/places')
}))


module.exports = router