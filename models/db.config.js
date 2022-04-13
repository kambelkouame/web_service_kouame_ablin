const mongoose = require('mongoose');
const loggers = require('../logger/logger');
mongoose.Promise = global.Promise;


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err) => {
    if (!err) {
        loggers.info('MongoDB connection succeeded.');
    } else {
        loggers.error('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)

        );
    }
});

require('./user.model');
require('./assignment.model');