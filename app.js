var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var app = express();

app.set('json spaces', 2);

err = undefined;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT");
    next();
});

app.use(express.static('public'));

app.get('*', function(req, res) {

    var home = true;

    if (req.path.includes('/protected')) {
        err = new Error('Path is Protected');
        err.status = 401;
    } else if (req.path.includes('/404')) {
        err = new Error('Not Found');
        err.status = 404;
    } else if (req.path.includes('/error')) {
        err = new Error('Error');
        err.status = 500;
    } else if (req.path.includes('/notimplemented')) {
        err = new Error('Not Implemented!');
        err.status = 501;
    } else if (req.path.includes('/login')) {
        res.sendFile(__dirname + '/public/login.html');
        home = false;
    }

    if (err) {
        console.log(err.status);
        res.status(err.status);
        res.render('error', {
            message: err.message,
            error: err
        });
    } else {
        if (home) {
            var myHeader, headerArray, key;
            myHeader = JSON.parse(JSON.stringify(req.headers));
            headerArray = [];
            for (key in myHeader) {
                headerArray.push(key); // Push the key on the array
                headerArray.push(myHeader[key]); // Push the key's value on the array
            }

            var jsonObj = {
                "method": req.method,
                "path": req.path,
                "host": req.host,
                "port": req.get('host').split(':')[1],
                "header": headerArray
            }
            console.log("\n");
            console.log(jsonObj);
            res.send(jsonObj);
        }
        // res.sendStatus(200);
    }
});

app.post('*', function(req, res) {

    var login = false;

    if (req.path.includes('/protected')) {
        err = new Error('Path is Protected');
        err.status = 401;
    } else if (req.path.includes('/404')) {
        err = new Error('Not Found');
        err.status = 404;
    } else if (req.path.includes('/error')) {
        err = new Error('Error');
        err.status = 500;
    } else if (req.path.includes('/notimplemented')) {
        err = new Error('Not Implemented!');
        err.status = 501;
    } else if (req.path.includes('/login')) {
        login = true;
    }

    if (err) {
        console.log(err.status);
        res.status(err.status);
        res.render('error', {
            message: err.message,
            error: err
        });
    } else {
        if (login) {

            var user = req.body.user;
            var pass = req.body.pass;

            var jsonObj = {
                "username": user,
                "password": pass
            }
            console.log(jsonObj);
            res.send(jsonObj);
        }
    }
});

app.listen(8080, function() {
    console.log('Example app listening on port 8080!')
})