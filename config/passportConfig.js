const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const { validator } = require("../helpers/validator");
const moment = require('moment');
const logger = require('../logger/logger');
const generatePassword = require('password-generator');

//import 
const User = mongoose.model('User');


const {
    usernameKeys,
    userState
} = require('./constant');

const accessDenied = 'Vous n\'avez pas les droits requis pour accéder à ce service.';
const notAuthenticate = 'Utilisateur non reconnu. Veuillez vérifier les identifiants.';
const incorrectPassword = 'Mot de passe incorrect.';

const client = 'client';
const admin = 'admin';

passport.use(
    new localStrategy({
            usernameField: 'email',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            if (req.body.type == "admin") {
                User.findOne({
                        email: email
                    },
                    (err, user) => {
                        console.log(user)
                        if (user) {
                            if (!user.verifyPassword(password)) { // Wrong password 
                                return done(null, false, {
                                    status: false,
                                    message: 'Mot de passe incorrect.'
                                });
                            } else if (!err && user && user.verifyPassword(password)) { // authentication succeeded
                                return done(null, user);
                            }
                        }
                        if (err) {
                            var errors = {
                                errUser: err
                            }
                            return done(JSON.stringify(errors));
                        } else if (!user) { // unknown user
                            return done(null, false, {
                                status: false,
                                message: 'Utilisateur non reconnu. Veuillez vérifier votre adresse mail'
                            });
                        }
                    });
            } else {
                return done(null, false, {
                    status: false,
                    message: accessDenied
                });
            }

        })
);