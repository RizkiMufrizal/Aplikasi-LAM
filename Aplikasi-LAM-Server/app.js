'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var morgan = require('morgan');
var path = require('path');
var csrf = require('csurf');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressPartials = require('express-partials');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var bodyParser = require('body-parser');
var logger = require('./configs/logger');

var User = require('./models/user');

var UserRoute = require('./routers/UserRoute');
var PostRoute = require('./routers/PostRoute');

var csrfProtection = csrf({
  cookie: true
});
var parseForm = bodyParser.urlencoded({
  extended: false
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('express').static(path.join(__dirname, 'public')));
app.use(require('express').static(path.join(__dirname, 'bower_components')));
app.use(expressPartials());
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined', {
  stream: logger.stream
}));
app.use(cookieParser());
app.use(expressSession({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username);
    User.findOne({
      email: username
    }, function(err, user) {
      console.log(user);
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) return done(null, false);
        return done(null, user);
      });
    });
  }
));

app.use('/api', UserRoute);

//batas csrf
app.use(csrfProtection);

function cekSessionLogin(req, res, next) {
  if (req.session.passport) {
    return next();
  }
  res.redirect('/login')
}

app.get('/', cekSessionLogin, function(req, res) {
  console.log(req.session.passport.user.email);
  res.render('index');
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  req.logout();
  console.log(req.session);
  res.redirect('/login');
});

app.get('/login', csrfProtection, function(req, res) {
  console.log(req.session);
  res.render('login', {
    csrfToken: req.csrfToken()
  });
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/register', csrfProtection, function(req, res) {
  res.render('register', {
    csrfToken: req.csrfToken()
  });
});

app.post('/register', parseForm, csrfProtection, function(req, res) {
  bcrypt.hash(req.body.password, 11, function(err, hash) {
    if (err) return res.send(err);

    var user = new User({
      email: req.body.email,
      nama: req.body.nama,
      password: hash
    });

    user.save(function(err) {
      if (err) return res.send(err);
      res.redirect('/login');
    });
  });
});

if ('development' === app.get('env')) {
  app.use(errorhandler());
}

mongoose.connect('mongodb://localhost/AplikasiLAM', function(err, res) {
  if (err) {
    logger.error('koneksi mongodb gagal bung', err);
  } else {
    logger.info('koneksi mongodb berhasil bung');
  }
});

app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403);
  res.send('form tampered with');
});

io.on('connection', PostRoute);

http.listen(app.get('port'), function() {
  logger.info('Server jalan pada port ' + app.get('port'));
});
