const express = require('express');
const UserModel = require('../models/user-model.js');
const router = express.Router();


router.get ('/findbuddy',(req, res, next) => {
  UserModel
    .find({
      location: req.user.location,
      fitness_level: req.user.fitness_level,
      fitness_goals: req.user.fitness_goals,
      gym_membership: req.user.gym_membership
    })
    // .sort({})

  .exec((err, allUsers) => {
      if (err){
        next(err);
        return;
      }
    res.locals.listOfUsers = allUsers;
    res.render('buddy-views/buddy-variations.ejs');
  });
});


module.exports = router;
