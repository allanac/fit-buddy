const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const UserModel = require('../models/user-model.js');

const router = express.Router();


router.get('/login', (req, res, next) => {
    if (req.user) {
      res.redirect('/');
      return;
    }
    res.locals.flashError = req.flash('error');
    res.locals.logoutFeedback = req.flash('logoutSuccess');
    res.locals.securityFeedback = req.flash('securityError');
    res.render('user-views/login-form.ejs');
});


router.post('/process-login', passport.authenticate('local',
    {
      successRedirect: '/',
      failureRedirect:'/login',
      failureFlash: true
    }
));


router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('logoutSuccess', 'Logout Successful');
    res.redirect('/login');
});



router.get('/signup', (req, res, next) => {
    if (req.user){
        res.redirect('/');
        return;
    }
    res.render('user-views/signup-form.ejs');
});



router.post('/process-signup', (req, res, next) => {
    if(req.body.signupEmail === "" || req.body.signupPassword === ""){
      res.locals.feedbackMessage = "We need both Email and Password"
      res.render('user-views/signup-form.ejs')
    }

    UserModel.findOne(
      {email: req.body.signupEmail},

      (err, userFromDb) => {
        if(err){
          next(err);
          return;
        }

        if(userFromDb){
          res.locals.feedbackMessage ='Email Taken'
          res.render('user-views/signup-form.ejs');
          return;
        }

        const salt = bcrypt.genSaltSync(10);
        const scrambledPass = bcrypt.hashSync(req.body.signupPassword, salt);

        const theUser = new UserModel({
            email: req.body.signupEmail,
            encryptedPassword: scrambledPass
        });

        theUser.save((err) =>{
            if(err){
              next(err);
              return;
            }
            req.flash('signupSuccess', 'Sign Up Successful! Try Logging in.')
            res.redirect('/login');
        });
      }
    );
});


router.get('/profile/:userId/edit', (req, res, next) => {
  //if THERE IS NO user
  // if the req.user._id !== req.params.userId

    UserModel.findById(
      req.params.userId,
      (err, userFromDb) => {
          if (err){
            next (err);
            return;
          }

          res.locals.userInfo = userFromDb;
          res.render('user-views/edit-profile.ejs');
      }
    );
});

router.post('/profile/:userId', (req,res,next) => {
  if (req.user === undefined) {
  req.flash('securityError', 'Log In to edit profile');
  res.redirect('/login');
  return;
    }
    UserModel.findById(
       req.params.userId,

       (err, userFromDb) => {
          if(err){
            next(err);
            return;
          }

        if (userFromDb._id.toString() !== req.user._id.toString()) {
        req.flash ('securityError', 'You can only edit your profile.');
        res.redirect('/');
        return;
          }

          userFromDb.name = req.body.firstName;
          userFromDb.gender = req.body.gender;
          userFromDb.location = req.body.userLocation;
          userFromDb.gym_membership = req.body.userGym;
          userFromDb.pref_workout_loc = req.body.workoutLocations;
          userFromDb.pref_workout_buddy = req.body.userBuddyPref;
          userFromDb.fitness_level = req.body.userFitLevel;
          userFromDb.fitness_goals = req.body.userFitGoals;
          userFromDb.availability_days = req.body.availableDays;
          userFromDb.availability_time = req.body.availableTimes;


       userFromDb.save ((err) => {
        if (err){
          next(err);
          return;
        }
        req.flash('updateSuccess', 'Profile Update Successful.');
        res.redirect('/');
      });
    }
  );
});








module.exports = router;