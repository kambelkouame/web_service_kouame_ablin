const fetch = require("node-fetch");
const mongoose = require('mongoose');
const { reject, respond } = require("../../helpers");
const { createElement, findElement, ControlUser, deleteElement, getAllElement } = require("../services/crud.services");

const { validator } = require("../../helpers/validator");
const { dataVerificator } = require("../services/dataVerification");
const { sendMail } = require("../services/generate.services");
const { generateUsername } = require("../services/generate.services");
const moment = require('moment');
const logger = require('../../logger/logger');
const generatePassword = require('password-generator');
const { hashPassword } = require('../../models/module_users/client.model');



//import 
const BankUser = mongoose.model('bankUser');
const Client = mongoose.model('Client');
const Wallet = mongoose.model('wallet');



//function



function generateInt(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


module.exports.createClient = async(req, res, next) => {
    //   try {
    var data = req.body
    var dataVerify = dataVerificator(data)
    var username = await generateUsername('client')
    var pass = generatePassword(12, false, /\d/, 'CB-')
    console.log(pass)
    var hashPass = hashPassword(pass);
    var saveData = new Client()
    saveData.nom = dataVerify.nom
    saveData.prenom = dataVerify.prenom
    saveData.email = dataVerify.email
    saveData.password = hashPass
    saveData.username = username


    var result = await createElement("client", "email", saveData.email, saveData, 1, "user")

    console.log(result.status)
    if (result.status == true) {
        var InfoCompte = dataVerify.compte

        var nbCmpte = generateInt(1, 5);
        console.log(nbCmpte)
        var walletId = []
        for (let i = 0; i < nbCmpte; i++) {
            var newWallet = new Wallet()
            newWallet.codeBanque = generatePassword(5, false, /\d/)
            newWallet.codeGuichet = generatePassword(5, false, /\d/)
            newWallet.numeroCompte = generatePassword(9, false, /\d/)
            newWallet.cleRib = generatePassword(2, false, /\d/)
            newWallet.iban = generatePassword(27, false, /\d/)
            newWallet.swift = generatePassword(8, false)
            var result = await createElement("wallet", "numeroCompte", newWallet.numeroCompte, newWallet, 1, "wallet")
            console.log(newWallet)
            walletId.push(newWallet._id)
        }

        saveData.wallet_id = walletId
        var result = await createElement("client", "email", saveData.email, saveData, 3, "user")
        await sendMail(saveData.email, pass);
        return respond(res, result.message)
    } else {
        return reject(res, result.message)
    }


    //  } catch (error) {
    //      logger.error(error)

    //   }

}

module.exports.getClient = async(req, res, next) => {
    try {

        var username = req.params.username
        var result = await findElement('client', 'username', username)
        return respond(res, result)
    } catch (error) {
        logger.error(error)

    }

}

module.exports.updateClientInfo = async(req, res, next) => {
    //  try {
    console.log(req.body)
    var username = req.params.username
    var result = await findElement('client', 'email', req.body.email)
    result.nom = req.body.nom
    result.prenom = req.body.prenom
    result.email = req.body.email
    result.telephone = req.body.telephone
    console.log(result)
    await result.save()
    return respond(res, result)
        //   } catch (error) {
        //       logger.error(error)

    //  }

}


module.exports.getAllClient = async(req, res, next) => {
    try {
        var username = req.params.username
        var result = await getAllElement('client')
        return respond(res, result)
    } catch (error) {
        logger.error(error)

    }

}


module.exports.controleClient = async(req, res, next) => {
    try {
        var data = req.body
        console.log(data.id)
        var result = await ControlUser("client", "_id", data.id, data.etat)
        console.log(result.status)
        if (result.status == true) {
            return respond(res, result.message)
        } else {
            return reject(res, result.message)
        }


    } catch (error) {
        logger.error(error)

    }

}


module.exports.deleteClient = async(req, res, next) => {
    try {
        var data = req.params.id
        var result = await deleteElement("client", "_id", data)
        console.log(result.status)
        if (result.status == true) {
            return respond(res, result.message)
        } else {
            return reject(res, result.message)
        }


    } catch (error) {
        logger.error(error)

    }

}






//management of the user




module.exports.createAdmin = async(req, res, next) => {
    //  try {
    var data = req.body
    var dataVerify = dataVerificator(data)
    var username = await generateUsername('client')
    var pass = generatePassword(12, false, /\d/, 'CB-')
    console.log(pass)
    var hashPass = hashPassword(pass);
    var saveData = new BankUser()
    saveData.nom = dataVerify.nom
    saveData.prenom = dataVerify.prenom
    saveData.email = dataVerify.email
    saveData.password = hashPass
    saveData.username = username

    logger.warn(saveData)
    var result = await createElement("admin", "email", saveData.email, saveData, 1, "user")

    console.log(result.status)
    if (result.status == true) {
        await sendMail(saveData.email, pass);
        return respond(res, result.message)
    } else {
        return reject(res, result.message)
    }


    // } catch (error) {
    //   logger.error(error)

    //}

}

module.exports.getAdmin = async(req, res, next) => {
    try {

        var username = req.params.username
        var result = await findElement('admin', 'username', username)
        return respond(res, result)
    } catch (error) {
        logger.error(error)

    }

}

module.exports.updateAdminInfo = async(req, res, next) => {
    //  try {
    console.log(req.body)
    var username = req.params.username
    var result = await findElement('admin', 'email', req.body.email)
    result.nom = req.body.nom
    result.prenom = req.body.prenom
    result.email = req.body.email
    result.telephone = req.body.telephone
    console.log(result)
    await result.save()
    return respond(res, result)
        //   } catch (error) {
        //       logger.error(error)

    //  }

}


module.exports.getAllAdmin = async(req, res, next) => {
    try {
        var username = req.params.username
        var result = await getAllElement('admin')
        return respond(res, result)
    } catch (error) {
        logger.error(error)

    }

}


module.exports.controleAdmin = async(req, res, next) => {
    try {
        var data = req.body
        console.log(data.id)
        var result = await ControlUser("admin", "_id", data.id, data.etat)
        console.log(result.status)
        if (result.status == true) {
            return respond(res, result.message)
        } else {
            return reject(res, result.message)
        }


    } catch (error) {
        logger.error(error)

    }

}


module.exports.deleteAdmin = async(req, res, next) => {
    try {
        var data = req.params.id
        var result = await deleteElement("admin", "_id", data)
        console.log(result.status)
        if (result.status == true) {
            return respond(res, result.message)
        } else {
            return reject(res, result.message)
        }


    } catch (error) {
        logger.error(error)

    }

}
module.exports.sendCredential = async(req, res, next) => {
        // try {

        console.log(req.body)

        var nom = req.body.nom
        var email = req.body.email
        var tmp = generatePassword(6, false, /\d/, '@')

        let firstChar = nom.charAt(0)
        let lastChar = nom.charAt(nom.length - 1)
        let password = firstChar + tmp + lastChar
        console.log(password)
        sendMail(email, password);
        return respond(res, "Message en cour d'envoie")





        // } catch (error) {
        //     logger.error(error)

        // }

    }
    /*
    module.exports.sendCredential = async(req, res, next) => {
        // try {

        console.log(req.body)

        var nom = req.body.nom
        var email = req.body.email
        var tmp = generatePassword(6, false, /\d/, '@')

        let firstChar = nom.charAt(0)
        let lastChar = nom.charAt(nom.length - 1)
        let password = firstChar + tmp + lastChar
        console.log(password)
        sendMail(email, password);
        return respond(res, "Message en cour d'envoie")





        // } catch (error) {
        //     logger.error(error)

        // }

    }*/