const mongoose = require('mongoose');
const { reject, respond } = require("../../helpers");
const { createElement, findElement, ControlUser, deleteElement, getAllElement } = require("../services/crud.services");
const passport = require('passport');
const { validator } = require("../../helpers/validator");
const { dataVerificator } = require("../services/dataVerification");
const { generateUsername, sendShortCode } = require("../services/generate.services");
const moment = require('moment');
const logger = require('../../logger/logger');
const generatePassword = require('password-generator');
const { hashPassword } = require('../../models/module_users/bank.user.model');
const {
    usernameKeys,
    userState,
    messages
} = require('../../config/constant');

//import 
const BankUser = mongoose.model('bankUser');
const Client = mongoose.model('Client');


module.exports.authenticate = (req, res, next) => {
    console.log(req.body)
        // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        // console.log(user)
        if (err) return res.status(200).json(err);
        // registered user
        else if (user) return res.status(200).json({
            status: true,
            firstconnexion: user.firstconnexion,
            "token": user.generateJwt()
        });
        // unknown user or wrong password
        else return res.status(200).json(info);
    })(req, res);
}

module.exports.updatePasswordFirstConnection = async(req, res, next) => {

    // try {

    return await updateModelPassword(req, res, {
        setFirstConnection: true
    });
    // } catch (error) {
    //       logger.error(error);
    //      return reject(res, messages.unexpectedErrorOccur);
    //   }

}



module.exports.sendCodeVerification = async(req, res, next) => {
    // try {
    const {
        username
    } = req.body;
    if (validator.isString(username) === false) {
        return reject(res, messages.usernameRequired);
    }

    const agent = await BankUser.findOne({
        email: username
    });
    if (agent == null)
        return reject(res, "veuillez creer un compte ");

    const tmpPass = await generatePassword(6, false, /\d/);
    // agent.password = hashPassword(tmpPass);
    // await agent.save()
    await sendShortCode(agent.email, tmpPass)
    var data = {
        codeOtp: tmpPass
    }

    return respond(res, data)
        // } catch (e) {
        //     logger.error(e);
        //      return reject(res, messages.unexpectedErrorOccur)
        //  }

}


module.exports.updatePassword = async(req, res, next) => {

    try {

        return await updateModelPassword(req, res);
    } catch (e) {
        logger(e);
        return reject(res, messages.unexpectedErrorOccur);
    }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} options 
 * @returns 
 * 
 * @requires options.setFirstConnection? // set to true to update 'firstConnect' at false
 */

async function updateModelPassword(req, res, options = {}) {

    //    try {
    const {
        username,
        password
    } = req.body;
    if (validator.isString(username) === false) {
        reject(res, messages.usernameRequired);
    }
    if (validator.isString(password) === false) { //TODO: use regex for password
        reject(res, messages.passwordRequired);
    }
    let Model = mongoose.model('bankUser'); // default value to check
    //Model = getPosModel(username);

    const admin = await Model.findOne({
        email: username
    });
    if (admin == null)
        return reject(res, messages.unexpectedErrorOccur);

    admin.password = hashPassword(password);
    if (options.setFirstConnection == true) admin.firstConnect = false;
    await admin.save();
    respond(res, true);
    ////  } catch (error) {
    //     logger.error(error);
    //     return reject(res, messages.unexpectedErrorOccur);
    // }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @requires req.body.username
 * 
 */
module.exports.getFirstConnectionState = async(req, res, next) => {
        // try {
        const {
            username
        } = req.body;
        // loggers.info(username)
        if (validator.isMail(username) === false) {
            reject(res, messages.usernameRequired);
        }

        let Model = mongoose.model('bankUser'); // default value to check

        const data = await Model.findOne({
            email: username
        });
        if (data == null) {
            return reject(res, messages.unexpectedErrorOccur);
        }
        return respond(res, data.firstConnect);
        //  } catch (error) {
        //      logger.error(error);
        //       return reject(res, messages.unexpectedErrorOccur);
        //   }
    }
    /*
    module.exports.getProfile = async(req, res, next) => {

        try {
            const admin = await BankUser.findById(req.pos._id).populate({
                path: 'id_pdv'
            });
            if (operateur == null) {
                return reject(res, recordNotFound);
            }
            operateur.informationsComp = operateur.id_pdv.informationsComp;

            const serviceClientNumber = await ctrlBackoffice.getParticularServiceClient(operateur.informationsComp.pays);
            if (serviceClientNumber.status) operateur['serviceclient'] = serviceClientNumber.number;

            //const keys = await getOperationsData(operateur);
            const keys = ['_id', 'fullName', 'username', 'phoneNumber', 'informationsComp', 'etat', 'serviceclient'];
            respond(res, _.pick(operateur, keys), 'operateur');
        } catch (e) {
            loggers.error(e);
            reject(res, unexpectErrorOccur);
        }
    }*/






//client connexion 




module.exports.authenticateClient = (req, res, next) => {
    console.log(req.body)
        // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        // console.log(user)
        if (err) return res.status(200).json(err);
        // registered user
        else if (user) return res.status(200).json({
            status: true,
            firstconnexion: user.firstconnexion,
            "token": user.generateJwt()
        });
        // unknown user or wrong password
        else return res.status(200).json(info);
    })(req, res);
}

module.exports.updatePasswordFirstConnectionClient = async(req, res, next) => {

    // try {

    return await updateModelPasswordClient(req, res, {
        setFirstConnection: true
    });
    // } catch (error) {
    //       logger.error(error);
    //      return reject(res, messages.unexpectedErrorOccur);
    //   }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} options 
 * @returns 
 * 
 * @requires options.setFirstConnection? // set to true to update 'firstConnect' at false
 */

async function updateModelPasswordClient(req, res, options = {}) {

    //    try {
    const {
        username,
        password
    } = req.body;
    if (validator.isString(username) === false) {
        reject(res, messages.usernameRequired);
    }
    if (validator.isString(password) === false) { //TODO: use regex for password
        reject(res, messages.passwordRequired);
    }
    let Model = mongoose.model('bankUser'); // default value to check
    //Model = getPosModel(username);

    const admin = await Model.findOne({
        email: username
    });
    if (admin == null)
        return reject(res, messages.unexpectedErrorOccur);

    admin.password = hashPassword(password);
    if (options.setFirstConnection == true) admin.firstConnect = false;
    await admin.save();
    respond(res, true);
    ////  } catch (error) {
    //     logger.error(error);
    //     return reject(res, messages.unexpectedErrorOccur);
    // }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @requires req.body.username
 * 
 */
module.exports.getFirstConnectionStateClient = async(req, res, next) => {
    // try {
    const {
        username
    } = req.body;
    // loggers.info(username)
    if (validator.isMail(username) === false) {
        reject(res, messages.usernameRequired);
    }

    let Model = mongoose.model('bankUser'); // default value to check

    const data = await Model.findOne({
        email: username
    });
    if (data == null) {
        return reject(res, messages.unexpectedErrorOccur);
    }
    return respond(res, data.firstConnect);
    //  } catch (error) {
    //      logger.error(error);
    //       return reject(res, messages.unexpectedErrorOccur);
    //   }
}