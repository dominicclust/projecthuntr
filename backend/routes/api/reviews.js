const express = require('express')
const asyncHandler = require('express-async-handler')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const { User, Project, Review } = require('../../db/models')

const router = express.Router()

const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage('Please leave feedback for the Project Owner'),
    check("rating")
        .isIn(['1', '2', '3', '4', '5'])
        .withMessage('Score must be a value between 1 and 5'),
    handleValidationErrors
]

router.get('/', asyncHandler(async (req, res) => {
    const reviews = await Review.findAll({include: [User, Project]})
    return res.json([...reviews])
}))

router.post('/', requireAuth, validateReview, asyncHandler (async (req, res) => {
    const {reviewerId, review, projectId, rating} = req.body;
    const newReview = await Review.create({reviewerId, review, projectId, rating})
    return res.json(newReview)
}))
router.put('/:reviewId', validateReview, asyncHandler (async (req, res) => {
    const { reviewId } = req.params;
    const {reviewerId, review, projectId, rating } = req.body
    const updatedReview = await Review.update({reviewerId, review, projectId, rating}, { where: {id: reviewId}})
    return res.json(updatedReview)
}))
router.delete('/:reviewId', asyncHandler (async (req, res) => {
    const {reviewId} = req.params
    const review = await Review.findByPk(reviewId)
    await review.destroy()
    return reviewId;
}))

module.exports = router;
