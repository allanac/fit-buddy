const express = require('express');
const UserModel = require('../models/user-model.js');
const router = express.Router();


router.get ('/findbuddy',(req, res, next) => {
  UserModel
    .find({
      userLocation: req.user.userLocation,
      userFitLevel: req.user.userFitLevel,
      userFitGoals: req.user.userFitGoals,
      userGym: req.user.userGym
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
