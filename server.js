const express = require("express");
const app = express();
const http = require("http").createServer(app);

const expressLayouts = require("express-ejs-layouts");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


// MIDDLEWARES
app.use(express.static("./public"));

// connect db
require("./db/connectDB");

// io 
require("./messaging")(http);

// Passport Config
require('./config/passport')(passport);


// ejs
app.use(expressLayouts);
app.set("view engine", 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  

  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


// ROUTES
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/auth"));
app.use("/chat", require("./routes/chat"));


const PORT = 9000;

http.listen(PORT, ()=> console.log(`server started on port ${PORT}`));