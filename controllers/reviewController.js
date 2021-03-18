let controller = {};
let models = require('../models');
let Review = models.Review;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.add = (review) => {
    return new Promise((resolve, reject) => {
        Review
            .findOne({
                where: {
                    userId: review.userId,
                    courseId: review.courseId,
                }
            })
            .then(data => {
                if (data) {
                    return Review.update(review, {
                        where: {
                            userid: review.userid,
                            courseid: review.courseid,
                        }
                    })
                } else {
                    return Review.create(review);
                }
            })
            .then(() => {
                models.Course
                    .findOne({
                        where: { id: review.courseid },
                        include: [{ model: models.Review }]
                    })
                    .then(course => {
                        let overallReview = 0;
                        for (let i = 0; i < course.Reviews.length; i++) {
                            overallReview += course.Reviews[i].rating;
                        }
                        overallReview = overallReview / course.Reviews.length;
                        course.overallReview = overallReview;
                        return models.Course.update({
                            overallReview: overallReview,
                            reviewCount: course.Reviews.length
                        }, {
                            where: { id: course.id }
                        })
                    });
            })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getUserReviewCourse = (userid, courseid) => {
    return Review.findOne({
        where: {
            userid,
            courseid
        }
    });
};

module.exports = controller;