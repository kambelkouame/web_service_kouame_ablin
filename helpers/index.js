function respond(res, data, key = 'data') {
    return res.status(200).jsonp({ status: true, [key]: data });
}
module.exports.respond = respond;

function reject(res, message, key = 'message', errors = []) {
    //return res.status(200).jsonp({ status: false, [key]: message });
    return res.jsonp({ status: false, [key]: message, errors: errors });
}
module.exports.reject = reject;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}