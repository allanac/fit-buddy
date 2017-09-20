const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const flash        = require('connect-flash');


require('./config/passport-config.js');


mongoose.connect('mongodb://localhost/fit-buddy');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - (FIT BUDDY APP TEST)';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(flash());
app.use(session(
  {
    secret: 'The best workout buddy finder ever',
    resave: true,
    saveUninitialized: true
  }
));
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
    // if we are loggin in, create the "currentUser" variable for views
    if(req.user){
      res.locals.currentUser = req.user;
    }
    // otherwise, make "currentUser" blank
    else {
      res.locals.currentUser = null;
    }

    next ();
});



// ------------- ROUTES ---------------//
const index = require('./routes/index');
app.use('/', index);

const myUserRoutes = require('./routes/user-router');
app.use(myUserRoutes);

const myBuddyRoutes = require('./routes/buddy-router');
app.use(myBuddyRoutes);

const myConversationRoutes = require('./routes/conversation-router');
app.use(myConversationRoutes);


// ------------- ROUTES ---------------//



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
