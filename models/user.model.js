const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const verifyPassword = function(password) { // change to this signature to get bound context
    return bcrypt.compareSync(password, this.password);
};


var userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    prenom: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    telephone: {
        type: String,
        default: "00225 00 00 00 00 00"
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    wallet_id: [],
    solde: {
        type: Number,
        default: 0,

    },
    username: {
        type: String,
        default: null,
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    temporary_password: {
        type: String,
        minlength: [4, 'Password must be atleast 4 character long']
    },
    etat: {
        type: Boolean,
        default: true
    },
    firstConnect: {
        type: Boolean,
        default: true
    },
    lastConnection: {
        type: Date,
        default: null
    },
    lastDeconnexion: {
        type: Date,
        default: null
    },
    lastOperationDate: {
        type: Date,
        default: null
    },
    dateSave: {
        type: Date,
        default: Date.now
    }
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


// don't move to helper index to prevent error in mongoose.model(xxx)
/**
 * 
 * @param {String} password , the mongoose model
 * @param {Function} next , callback in mongoose model
 * 
 * @description
 */
const hashPassword = (password) => {

    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}



userSchema.methods.generateJwt = function() {
    const xsrfToken = crypto.randomBytes(64).toString('hex');
    return jwt.sign({ _id: this._id, xsrfToken },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXP
        });
}
userSchema.methods.verifyPassword = verifyPassword;
mongoose.model('User', userSchema);



const generateJwt = (self, type) => {

    const options = {
        expiresIn: process.env.JWT_EXP
    };
    const xsrfToken = crypto.randomBytes(64).toString('hex');
    const payload = {
        _id: self._id,
        nom: self.nom,
        prenom: self.prenom,
        email: self.email,
        xsrfToken: xsrfToken,
        type: type
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports.verifyPassword = verifyPassword;
module.exports.generateJwt = generateJwt;

module.exports.hashPassword = hashPassword;