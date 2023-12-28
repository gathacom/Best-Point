const Place = require('../models/place');
const fs = require('fs');
const { geometry } = require('../utils/hereMaps');
const ExpressError = require('../utils/ErrorHandler');

module.exports.index = async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places })
}

module.exports.store = async (req, res, next) => {
    const {place} = req.body
    const location = `${place.title}, ${place.city}, ${place.country}`

    const images = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))

    const geoData = await geometry(location)

    const newPlace = new Place(place);
    newPlace.location = location;
    newPlace.author = req.user._id;
    newPlace.images = images;
    newPlace.geometry = geoData;

    await newPlace.save(); 
    req.flash('success_msg','Successfully made a new place!');
    res.redirect('/places');
}
module.exports.show = async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author');
    res.render('places/show', { place })
}
module.exports.edit = async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id);
    res.render('places/edit', { place })
}
module.exports.update = async (req, res) => {
    const {place} = req.body;
    const {id} = req.params;
    const updatedPlace = await Place.findByIdAndUpdate(id, {...place});

    if(req.files && req.files.length > 0){

        updatedPlace.images.forEach(image => {
            fs.unlink(image.url, err => new ExpressError(err))
        })

        const images = req.files.map(file => ({
            url: file.path,
            filename: file.filename,
        }))
        updatedPlace.images = images
        await updatedPlace.save();
    }

    req.flash('success_msg','Successfully updated place!');
    res.redirect(`/places/${id}`)
}

module.exports.destroy = async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id);

    if(place.images.length > 0){
        place.images.forEach(image => {
            fs.unlink(image.url, err => new ExpressError(err))
        })
    }
    await place.deleteOne();
    req.flash('success_msg','Successfully deleted place!');
    res.redirect('/places')
}

module.exports.destroyImage = async (req, res) => {
    try {
        const {id} = req.params
        const {images} = req.body

        if(!images || images.length === 0){
            req.flash('error_msg', 'No image selected');
            return res.redirect(`/places/${id}/edit`)
        }

        images.forEach(image => {
            fs.unlinkSync(image)
        })

        await Place.findByIdAndUpdate(
            id,
            {$pull: {images: {url: {$in: images}}}},
        )
        req.flash('success_msg', 'Successfully deleted image');
        return res.redirect(`/places/${id}`)
    } catch (error) {
        req.flash('error_msg', 'Failed to delete image');
        return res.redirect(`/places/${id}/edit`)
    }
}
