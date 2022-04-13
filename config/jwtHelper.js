const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return res.status(200).send({ status: false, auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    logger.error(err);
                    return res.status(200).send({ status: false, auth: false, message: 'Token authentication failed.' });
                } else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}