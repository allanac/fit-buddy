const passport = require('passport');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model.js');

const LocalStrategy = require('passport-local').Strategy;
// const FbStrategy = require('passport-facebook').Strategy;


passport.serializeUser((userFromDb, done) => {
    done(null, userFromDb._id);
});

passport.deserializeUser((idFromBowl, done) => {
    UserModel.findById(
        idFromBowl,

        (err, userFromDb) => {
            if (err){
              done(err);
              return;
            }
            done(null, userFromDb);
        }
    )
});

passport.use(
    new LocalStrategy (
      {
        usernameField: 'loginEmail',
        passwordField: 'loginPassword'
      },

      (emailValue, passValue, done) => {
        UserModel.findOne(
          {email: emailValue},

          (err, userFromDb) => {
              if(err) {
                done (err);
                return;
              }

              if(userFromDb === null) {
                  done(null, false, {message: 'Email is wrong!'});
                  return;
              }

              const isGoodPassword = bcrypt.compareSync(passValue, userFromDb.encryptedPassword);

              if(isGoodPassword === false) {
                done( null, false, {message: 'Password is wrong!'});
                return;
              }

              done(null,userFromDb);

          }
        )
      }
    )
);
