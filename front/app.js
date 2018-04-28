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


app.use("/app.js", express.static(__dirname + '/app.js'));

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

app.get('/addEmployee', function(req, res) {
    res.sendFile(curr_dir +'/views/addEmployee.html')
})

app.post('/addEmployee', function(req, res) {
    var Firstname = req.body.firstname;
    var LastName = req.body.lastname;
    var Gender = req.body.gender;
    var Age = parseInt(req.body.age, 10);
    var ID = parseInt(req.body.id, 10);
    var Salary = parseInt(req.body.salary, 10);

  axios.post('http://localhost:5000/employee', {
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
              res.redirect("/addEmployee");
})


app.get('/showEmployees', function(req, res) {
    res.sendFile(curr_dir +'/views/showEmployees.html')
})


app.get('/searchEmployee', function(req, res) {
    res.sendFile(curr_dir +'/views/searchEmployee.html')
})

app.get('/showSearchEmployee', function(req, res) {
    res.sendFile(curr_dir +'/views/showSearchEmployee.html')
})


app.post('/showSearchEmployee', function(req, res) {
  
     res.redirect("/showSearchEmployee");
})





app.listen(4000);
console.log("Running app at port 4000");



function EmployeeReport() {
  var $s = $('#result');
  var extra_space = '&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

  var space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
  axios.get('http://localhost:5000/employees')
    .then(function (response) {
      for (var i = 0; i < response.data.length; i ++) {
           $s.append('<tbody> <tr>');
           $s.append('<td>' + space + response.data[i].firstname + extra_space + extra_space + extra_space + extra_space + extra_space + space + space  + '</td>')
           $s.append('<td>' + response.data[i].lastname + extra_space + extra_space + extra_space + extra_space + space + space + space +'</td>')
           $s.append('<td>' + response.data[i].gender + extra_space + extra_space + extra_space + extra_space + space + '</td>')
           $s.append('<td>' + response.data[i].age +  extra_space + extra_space + extra_space + '</td>')
           $s.append('<td>' + response.data[i].salary + '</td>')
           $s.append('  </tr>' + ' </tbody> ')
      }
     
       console.log(response.data[0].firstname)
       console.log(response.data.length)
    })
    .catch(function (error) {
      //resultElement.innerHTML = generateErrorHTMLOutput(error);
    });   

    $s.append(' </table>')
}


function searchEmployee() {
   var $s = $('#result');
  

  $('#search_employee_button').on('click', function() { 
    var ID = $('#search_employee_field').val()
    var extra_space = '&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

  var space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
   
     axios.get('http://localhost:5000/employee/'+ID)
    .then(function(response) {
     
        localStorage.setItem("employee_first_name", response.data.firstname);
        localStorage.setItem("employee_last_name", response.data.lastname);
        localStorage.setItem("employee_gender", response.data.gender);
        localStorage.setItem("employee_age", response.data.age);
        localStorage.setItem("employee_salary", response.data.salary)
         localStorage.setItem("employee_id", ID);
    }); 


  })

}


function showSearchEmployee() {
    var firstname = localStorage.getItem("employee_first_name")
    var lastname = localStorage.getItem("employee_last_name")
    var gender = localStorage.getItem("employee_gender")
    var age = localStorage.getItem("employee_age")
    var salary = localStorage.getItem("employee_salary")
    var id = localStorage.getItem("employee_id")
    var $s = $('#result');
    var $showID = $('#showID');
    $showID.append('<h1> Employee ID ' + id + ' Basic Info </h1>')
    var extra_space = '&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

  var space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
  var small_space = '&nbsp;&nbsp;&nbsp;';
   
    $s.append('<tbody> <tr>');
    $s.append('<td>' + space + firstname + extra_space + extra_space + extra_space + extra_space + extra_space + space + space  + '</td>')
    $s.append('<td>' + lastname + extra_space + extra_space + extra_space + extra_space + space + space + space + space + small_space +'</td>')
    $s.append('<td>' + gender + extra_space + extra_space + extra_space + extra_space + space + '</td>')
    $s.append('<td>' + age +  extra_space + extra_space + extra_space + '</td>')
    $s.append('<td>' + salary + '</td>')
    $s.append('  </tr>' + ' </tbody> ')



}