const Joi = require('joi');

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.string().required(),
        comment: Joi.string().required(),
    }).required()
})
