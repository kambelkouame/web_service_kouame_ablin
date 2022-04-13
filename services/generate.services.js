const fetch = require("node-fetch");
const mongoose = require('mongoose');
const { reject, respond } = require("../../helpers");
const { validator } = require("../../helpers/validator");
const moment = require('moment');
const logger = require('../../logger/logger');

//import 
const User = mongoose.model('User');
const nodemailer = require("nodemailer");

const { usernameKeys } = require('../../config/constant');

const mqashLogoURI = 'https://mqash.com/assets/images/logo_.png';

const mailConfig = {
    host: 'ssl0.ovh.net',
    port: 465,
    secure: true,
    auth: {
        user: "contact@mqashgroup.com",
        pass: "Mqash2021"
    },
    tls: {
        // do not failed on invalid certs
        rejectUnauthorized: false
    }
};

module.exports.sendtrapMail = (req, res) => {
    var mail = sendMail(req.body.mail)
    res.jsonp({ data: mail })
}

async function generateUsername(modelClass) {
    try {
        let key = null;
        let Model = null;
        if (modelClass == 'client') {
            key = usernameKeys.client;
            Model = Client;
        }
        if (modelClass == 'admin') {
            key = usernameKeys.admin;
            Model = BankUser;
        }


        let number = await Model.countDocuments();
        number += 1;
        let username = key + '-00' + number;
        let info = await Model.findOne({ username: username });
        while (info !== null) {
            number += 1;
            username = key + '-00' + number;
            info = await Model.findOne({ username: username });
        }

        return username;
    } catch (error) {
        loggers.error(error);
        return null;
    }
}
module.exports.generateUsername = generateUsername;

async function sendCredentialsByMail(receiverEmail, password) {

    let transporter = nodemailer.createTransport(mailConfig);
    //const type = pipePosType(username);
    const html = `<html><head><style>.container{width: 600px;padding: 20px;margin: 20px auto;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}.logo {margin: 0 auto;display: block; }</style>
    </head><body><div class="container"><div class="header"><img class="logo" src="${mqashLogoURI}" width="300" height="100" /></div><div class="content">
    <p>
        Bonjour Monsieur/Madame,<br>
        Vous avez été enregistréau niveau ChatBot Banquing de CCEI. Votre identifiant est votre numero de téléphone. Votre mot de passe temporaire est :${password} <br>
       Vous recevrez un message du ChatBot par whatapp<br>
    <p>
    </div></div></body></html>`;

    let mailOptions = {
        from: "contact@mqashgroup.com",
        to: receiverEmail,
        subject: 'ChatBot Banquing',
        html: html
    };

    let info = await transporter.sendMail(mailOptions);
    return info;
}
module.exports.sendMail = sendCredentialsByMail;




async function sendShortCode(receiverEmail, code) {

    let transporter = nodemailer.createTransport(mailConfig);
    //const type = pipePosType(username);
    const html = `<html><head><style>.container{width: 600px;padding: 20px;margin: 20px auto;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}.logo {margin: 0 auto;display: block; }</style>
    </head><body><div class="container"><div class="header"><img class="logo" src="${mqashLogoURI}" width="300" height="100" /></div><div class="content">
    <p>
        Bonjour Monsieur/Madame,<br>
        Veuillez saisir ce code ${code}.afin de reinitialiser le mot de passe de votre compte<br>
       <br>
    <p>
    </div></div></body></html>`;

    let mailOptions = {
        from: "contact@mqashgroup.com",
        to: receiverEmail,
        subject: 'ChatBot Banquing',
        html: html
    };

    let info = await transporter.sendMail(mailOptions);
    return info;
}
module.exports.sendShortCode = sendShortCode;