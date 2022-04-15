require('./config/config');
require('./models/db.config');
require('./config/passportConfig');
const loggers = require('./logger/logger');


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const morgan = require('morgan');
const moment = require('moment');

let port = process.env.PORT || 8010;
var app = express();

const whitelist = ['http://localhost:4200', 'http://localhost:3000', 'http://127.0.0.1:4200'];
const corsOptions = {
    origin: function(origin, callback) {
        return callback(null, true); // allow all
        if (whitelist.indexOf(origin) !== -1) {
            return callback(null, true)
        } else {
            return callback(new Error('Not allowed by CORS'))
        }
    },
}


// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



//app.use(morgan('combined'));
app.use(morgan('dev'));
app.use(morgan('tiny', { stream: loggers.stream }));
// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors(corsOptions));
app.use(passport.initialize());
//monit my server
app.use(require('express-status-monitor')());

app.set('view engine', 'pug');
app.use(express.static("public"))

app.set("views", path.join(__dirname, 'public/views'));




const assignRouter = require('./routes/assignment.router');


app.use('/api', assignRouter);



loggers.warn('ENV ENTER:' + process.env.NODE_ENV);

//app.listen(process.env.PORT, () => loggers.info(`Server started at port : ${process.env.PORT}`));
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;
/*
app.route(prefix + '/assignments')
    .get(assignment.getAssignments)
    .post(assignment.postAssignment)
    .put(assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
    .get(assignment.getAssignment)
    .delete(assignment.deleteAssignment);


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;*/