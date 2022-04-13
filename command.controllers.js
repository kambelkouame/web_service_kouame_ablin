const fetch = require("node-fetch");
const mongoose = require('mongoose');
const { reject, respond } = require("../../helpers");
const { createElement, findElement, ControlUser, logFunction, deleteElement, findManyElementPopulateClient, getAllElementPopulateClient, getAllElement } = require("../services/crud.services");

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
const Command = mongoose.model('command');



module.exports.createCommand = async(req, res, next) => {
    //  try {
    var data = req.body
    var commandeReference = generatePassword(10, false, /\d/, 'B')
    console.log(commandeReference)
    var findClient = await findElement('client', '_id', data.idClient)
    console.log(findClient)
    await logFunction(data.idClient, "commande de " + data.command)
    if (findClient && Object.keys(findClient).length > 0) {

        var saveData = new Command()
        saveData.idClient = data.idClient
        saveData.command = data.command
        saveData.nombre = data.nombre
        saveData.numeroCompte = data.numeroCompte
        saveData.reference = commandeReference
        logger.warn(saveData)
        var result = await createElement("command", "email", saveData.email, saveData, 3, "cmd")
        console.log(result)
        if (result.status == true) {
            return respond(res, result.message)
        } else {
            return reject(res, result.message)
        }

    } else {

        return reject(res, "le client n'existe pas veuillez vous enregistrer")
    }



    //   } catch (error) {
    //      logger.error(error)

    //   }

}


module.exports.getAllCommand = async(req, res, next) => {
    //   try {
    var result = await getAllElementPopulateClient('command')
    return respond(res, result)
        //    } catch (error) {
        //       logger.error(error)

    //   }

}



module.exports.controlCommand = async(req, res, next) => {
    //   try {
    var data = req.body
    console.log(data.id)
    var result = await ControlUser("command", "_id", data.id, data.etat)
    console.log(result.status)
    if (result.status == true) {
        return respond(res, result.message)
    } else {
        return reject(res, result.message)
    }


    //  } catch (error) {
    //       logger.error(error)

    //   }

}


module.exports.getCommandType = async(req, res, next) => {
    try {

        var command = req.params.command

        var result = await findManyElementPopulateClient('command', 'command', command)
        return respond(res, result)
    } catch (error) {
        logger.error(error)
        return reject(res, error)
    }

}