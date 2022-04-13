const { validator } = require("../../helpers/validator");



function dataVerificator(data) {

    if (data && Object.keys(data).length > 0) {


        if (typeof nom !== 'undefined') {
            if (validator.isString(nom)) result.nom = nom;
            else errors.push('nom');
        }

        if (typeof prenom !== 'undefined') {
            if (validator.isString(prenom)) result.prenom = prenom;
            else errors.push('prenom');
        }

        if (typeof email !== 'undefined') {
            if (validator.isMail(email)) result.email = email;
            else errors.push('email');
        }

        return data

    }

}
module.exports.dataVerificator = dataVerificator;