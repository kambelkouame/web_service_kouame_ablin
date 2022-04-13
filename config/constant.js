module.exports.roles = [
    "admin",
    "banker",
    "audit"

];


module.exports.userState = {
    valid: 'Validate',
    invalid: 'Invalidate',
    pending: 'Pending'
}

module.exports.usernameKeys = {
    "admin": "admin",
    "client": "user"

}


module.exports.messages = {
    "400": "Bad Request.",
    "500": "An unexpected error occured.",

}