const fetch = require("node-fetch");
const mongoose = require('mongoose');
const { reject, respond } = require("../helpers");
const { validator } = require("../helpers/validator");
const moment = require('moment');
const logger = require('../../logger/logger');

//import 
const User = mongoose.model('User');

//message
//error message
var createError1 = "le email est déjà associé à un utilisateur"


//success message
var createSucces1 = "l'enregistrement a été effectué  avec sucess"
var updateSucces = "la mise a jour a été effectué avec succes"
var controleSucces = "l'etat del'utilisateur a été mise a jour"
var deleteSuccess = "supression éffectuée avec success"
    //surch error
var findError = "not exist"


function chooseModel(model) {
    if (model === "user") {
        return User
    }
}

async function createElement(model, search_field, search_value, data, mode, type) {
    var modelClass = chooseModel(model)
    var query = {}
    var searchElement = {}
    if (mode === 1) {
        query[search_field] = search_value;
        var searchElement = await modelClass.findOne(query)
        logger.info(searchElement)
    }

    console.log(searchElement)
    if (mode === 1) {
        logger.info("ok")

        if (searchElement && Object.keys(searchElement).length > 0) {
            var mess = {
                status: false,
                message: createError1
            }
            return mess
        } else {
            await data.save()
            logger.info(searchElement)
            if (type == "user") {

            }

            var mess = {
                status: true,
                message: createSucces1
            }
            return mess

        }

    } else {
        await data.save()
        logger.info(searchElement)
        if (type == "user") {

        }

        var mess = {
            status: true,
            message: createSucces1
        }
        return mess
    }

}


async function updateElement(model, data) {

    var searchElement = await model.findOne({ _id: data._id })
    if (searchElement && Object.keys(searchElement).length > 0) {
        searchElement = data
        await searchElement.save()
        return respond(res, searchElement)
    } else {
        return reject(res, findError)
    }

}

async function findElement(model, search_field, search_value) {
    var query = {}
    var modelClass = chooseModel(model)
    query[search_field] = search_value;
    var searchElement = await modelClass.findOne(query).sort({ "dateSave": 1 })

    return searchElement


}
async function findManyElement(model, search_field, search_value) {
    var query = {}
    var modelClass = chooseModel(model)
    query[search_field] = search_value;
    var searchElement = await modelClass.find(query).sort({ "dateSave": 1 })

    return searchElement


}



//log function (trace clients action)

async function logFunction(idClient, action) {
    var log = new Log()
    log.idUser = idClient,
        log.action = action
    log.save()



}


async function findManyElementPopulateClient(model, search_field, search_value) {
    var query = {}
    var modelClass = chooseModel(model)
    query[search_field] = search_value;
    var searchElement = await modelClass.find(query).populate("idClient").sort({ "dateSave": 1 })

    return searchElement


}

async function ControlUser(model, search_field, search_value, newValue) {
    var query = {}
    var modelClass = chooseModel(model)
    query[search_field] = search_value;
    console.log(query)
    var searchElement = await modelClass.findOne(query)
    console.log(searchElement)
    console.log(newValue)
    searchElement.etat = newValue
    await searchElement.save()
    var mess = {
        status: true,
        message: controleSucces
    }
    return mess

}


async function getAllElementPopulateClient(model) {
    var modelClass = chooseModel(model)
    var searchElement = await modelClass.find().populate("idClient").sort({ "dateSave": 1 })

    return searchElement
}


async function getAllElementPopulateClientTransaction(model) {
    var modelClass = chooseModel(model)
    var searchElement = await modelClass.find().populate("idClient").populate("compteWalletSender").populate("compteWalletReceiver")

    return searchElement

}


async function getAllElement(model) {
    var modelClass = chooseModel(model)
    var searchElement = await modelClass.find()

    return searchElement

}

async function deleteElement(model, search_field, search_value) {
    var query = {}
    var modelClass = chooseModel(model)
    query[search_field] = search_value;
    var searchElement = await modelClass.deleteOne(query)
    console.log(searchElement)
    var mess = {
        status: true,
        message: deleteSuccess
    }
    return mess


}




module.exports.logFunction = logFunction
module.exports.getAllElementPopulateClientTransaction = getAllElementPopulateClientTransaction
module.exports.findManyElementPopulateClient = findManyElementPopulateClient
module.exports.getAllElementPopulateClient = getAllElementPopulateClient
module.exports.findManyElement = findManyElement
module.exports.getAllElement = getAllElement
module.exports.deleteElement = deleteElement
module.exports.ControlUser = ControlUser
module.exports.createElement = createElement
module.exports.updateElement = updateElement
module.exports.findElement = findElement