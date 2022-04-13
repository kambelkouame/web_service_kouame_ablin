const jwt = require('jsonwebtoken');
const { logger } = require('../helpers/logger');

const failed = 'ForbiddenActionForUser';
const posTypes = ['distributeur', 'independant', 'sous-distributeur', 'pdv', 'operateur', 'conformite','partner'];

const inTypes = (types, arg) => {
    const typesLowered = types.map(e => e.toLowerCase());
    return typesLowered.includes(arg);
}

const isType = (type, arg) => {
    return type.toLowerCase() === arg.toLowerCase();
}

const f_type = (a) => {

  if(typeof a === "string"){
    return 'string';
  }
  if(typeof a === "object" && Array.isArray(a)){
    return 'array';
  }
  else return null;
}

const getToken = (header) => {
    
    if(typeof header != "string") return null;

    const arr = header.split(' ');
    if(arr.length != 2) return null;

    const r = arr[1];
    if(r.includes('Bearer ') == true) return null;

    if(r.length == 0) return null;

    return r;
}
/**
 * 
 * @param {*} types , an array of string or a single, string can be in UPPERCASE or lowercase
 */
const type = (types = null) => {

    if(types == null){
        return (req, res, next) => {
            res.jsonp({ status: false, auth: false, message: failed })
        };
    }

    return (req, res, next) => {
        const token = getToken(req.headers['authorization']);
        if (token == null)
            return res.jsonp({ status: false, auth: false, message: 'No token provided.' });
        else {
            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if(('type' in decoded) == false){
                    return res.jsonp({ status: false, auth: false, message: failed });
                }

                let foo = false;
                if(f_type(types) == 'string')   foo = isType(types, decoded.type);
                if(f_type(types) == 'array')    foo = inTypes(types, decoded.type); 

                if(foo == false){
                    return res.jsonp({ status: false, auth: false, message: failed });
                }

                if(('_id' in req) == false) req._id = decoded._id;
                req.pos = { // pos been split into items of posTypes
                    '_id': decoded._id,
                    'type': decoded.type
                };
                next();
            }
            catch(e){
                logger(e);
                return res.jsonp({ status: false, auth: false, message: failed});
            }
        }
    }
}

module.exports.type = type;
