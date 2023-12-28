const express = require('express');
const ReviewsController = require('../controllers/reviews');
const wrapAsync = require('../utils/wrapAsync');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const { isAuthorReview } = require('../middlewares/isAuthor');
const { validateReview } = require('../middlewares/validator');

const router = express.Router({mergeParams: true});
router.post('/',isAuth, isValidObjectId('/places'),validateReview, wrapAsync(ReviewsController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewsController.destroy))

module.exports = router