var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var path = require('path')
var cookieParser = require('cookie-parser')
var exphbs = require('express-handlebars')
var expressValidator = require('express-validator')
var flash = require('connect-flash');
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local'),Strategy;
var passportLocalMongoose = require('passport-local-mongoose')
var mongo = require('mongodb')
var mongoose = require('mongoose');
var User = require("./models/user");
var axios = require("axios");

/*

axios.get('http://localhost:3000/employees')
    .then(function(response) {
        console.log(response.data[0].firstname)
    });
*/

mongoose.connect('mongodb://localhost/loginapp');

app.use(require("express-session")({
    secret: "A word",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

var db = mongoose.connection;


var curr_dir = process.cwd()
app.use(express.static("/"));




app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));







app.get('/', function(req, res) {
     res.sendFile(curr_dir +'/views/landing.html');
});

app.get('/createBurger', function(req, res) {
	res.sendFile(curr_dir +'/views/createBurger.html')
})

app.get('/secondary_landing', isLoggedIn, function(req, res) {
   
	res.sendFile(curr_dir +'/views/secondary_landing.html')
   
})

/*

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  console.log(req.user)
  next();
})
*/

app.post("/signup", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
         if (err) {
         	console.log(err);
         	return res.sendFile(curr_dir +'/views/landing.html');
         }
         passport.authenticate("local")(req, res, function() {
             res.redirect("/secondary_landing");
         });
	});

})


app.post('/login', passport.authenticate("local", {
	 successRedirect: "/secondary_landing",
	 failureRedirect: "/"
}) , function(req, res){
   
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect("/")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}


app.get('/starters', function(req, res) {
	res.sendFile(curr_dir +'/views/starters.html')
})

app.get('/burger', function(req, res) {
	res.sendFile(curr_dir +'/views/burger.html')
})

app.get('/shakes', function(req, res) {
	res.sendFile(curr_dir +'/views/shakes.html')
})

app.get('/payment', function(req, res) {
    res.sendFile(curr_dir +'/views/payment.html')
})

app.get('/employee', function(req, res) {
    res.sendFile(curr_dir +'/views/employee.html')
})

app.post('/employee', function(req, res) {
    var Firstname = req.body.firstname;
    var LastName = req.body.lastname;
    var Gender = req.body.gender;
    var Age = parseInt(req.body.age, 10);
    var ID = parseInt(req.body.id, 10);
    var Salary = parseInt(req.body.salary, 10);

  axios.post('http://localhost:3000/employee', {
        FirstName: Firstname,
        LastName: LastName,
        Gender: Gender,
        Age: Age,
        ID: ID,
        Salary: Salary
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
              res.redirect("/employee");
})





app.listen(4000);
console.log("Running app at port 4000");
