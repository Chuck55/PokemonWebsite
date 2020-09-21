// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

var google = false;

// include the mysql module
var mysql = require("mysql");
var loginRight = false;
// apply the body-parser middleware to all incoming requests
app.use(bodyparser());
app.use( bodyparser.json() );       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9096, () => console.log('Listening on port 9096!'));


// PAGE FUNCTIONS
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/src/login.html');
});
app.get('/MainPage',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/MainPage.html');
  }
});

app.get('/PokemonList',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/PokemonList.html');
  }
});

app.get('/communityDays',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/communityDays.html');
  }
});

app.get('/ShinyList', function (req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/ShinyList.html');
  }
});
app.get('/100IV', function (req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/100IV.html');
  }
});
app.get('/guessing', function (req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/guessingGame.html');
  }
});

app.get('/login',function(req, res) {
  if (req.session.value) {
    res.redirect('/MainPage');
  } else {
    res.sendFile(__dirname + '/src/login.html');
  }
});
app.get('/aboutMe',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/src/aboutMe.html');
  }
});
app.get('/ShinyDatabase',function(req, res) {
    res.sendFile(__dirname + '/src/ShinyDatabase.html');
});
app.get('/logoutHTML',function(req, res) {
  res.sendFile(__dirname + '/src/logout.html');
});
app.get('/footer',function(req, res) {
  res.sendFile(__dirname + '/src/footer.html');
});
app.get('/header',function(req, res) {
  res.sendFile(__dirname + '/src/header.html');
});
app.get('logoutHTML', function(req, res) {
  res.sendFile(__dirname + '/src/logout.html');
});

//Page details, js, css
app.get('/stylesPages', function(req, res) {
  res.sendFile(__dirname + '/src/stylesPages.css');
});
app.get('/scrollbar.js' ,function(req, res) {
  res.sendFile(__dirname + '/src/scrollbar.js');
});

app.get('/googleLogin.js' ,function(req, res) {
  res.sendFile(__dirname + '/src/googleLogin.js');
});



// Supporting functions, retrieving JSON
app.post('/getJSON',function(req, res) {
  console.log(req.body);
  if (req.body.fname == "KyueShiny") {
    fileName = "C:\JSON\\Kyue55.json";
  } else if (req.body.fname == "WatermelonShiny"){
    fileName = "C:\JSON\\Watermelon.json";
  } else if (req.body.fname == "BrightestShiny") {
    fileName = "C:\JSON\\BrightestDawn.json";
  } else if (req.body.fname == "BlackestShiny") {
    fileName = "C:\JSON\\BlackestNight.json";
  } else if (req.body.fname == "KyueIV") {
    fileName = "C:\JSON\\Kyue55IV.json";
  } else if (req.body.fname == "BlackestIV") {
    fileName = "C:\JSON\\BlackestNightIV.json";
  } else if (req.body.fname == "BrightestIV") {
    fileName = "C:\JSON\\BrightestDawnIV.json";
  } else if (req.body.fname == "WatermelonIV") {
    fileName = "C:\JSON\\WatermelonIV.json";
  } else if (req.body.fname == "Pokemon") {
    fileName = "C:\JSON\\pokemon.json";
  }
  fs.readFile(fileName, function(err, json) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.write(json);
    res.end();
  });
});

// Supporting functions, retrieving SQL
app.post('/getSQL', function (req, res) {
   
  var sql = require("mssql/msnodesqlv8");

  // config for your database
  var config = {
    driver: "msnodesqlv8",
    server: "localhost",
    database: "PokemonGoInfo",
    options: {
      trustedConnection: true,
      useUTC: true,
      json: true
    }
  }
  // connect to your database
  sql.connect(config, function (err) {
      if (err) console.log(err);
      // create Request object
      var request = new sql.Request();   
      // query to the database and get the records
      request.query('select * from ' + req.body.fname, function (err, recordset) {
          if (err) console.log(err)
          res.statusCode = 200;
          res.setHeader('Content-type', 'text/plain');
          res.write(JSON.stringify(recordset));
          res.end();
      });
  });
});


app.post('/sendGoogleDetails', function(req, res){
  var sess = req.session;
  google = true;
  sess.value = 1;
  sess.save();
  res.write(JSON.stringify({Stuff:true}));
  res.end();
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) { 
  var found = false;
  var username = req.body.Username;
  var sess = req.session;
  var password = req.body.Password;
  if (("Kyle" == username) && ("Meng" == password)) {
    sess.value = 1;
		sess.save();
		res.write(JSON.stringify({Stuff:true}));
		res.end();
		found = true;
  }
	if (!found) {
  	res.write(JSON.stringify({Stuff:false}));
		res.end();
	}
});


// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  req.session.destroy();
  if (google) {
    res.redirect('/logoutHTML');
  } else {
    res.redirect('/login');
  }
});

// middle ware to serve static files
app.use('/src', express.static(__dirname + '/src'));
app.use('/pictures', express.static(__dirname + '/pictures'));
app.use('/JSON', express.static(__dirname + '/JSON'));
app.use('/guessingGamePics', express.static(__dirname + '/guessingGamePics'));
app.use('/leaguePics', express.static(__dirname + '/leaguePics'));
app.use('/Audio', express.static(__dirname + '/Audio'));

// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.sendStatus(404);
});
