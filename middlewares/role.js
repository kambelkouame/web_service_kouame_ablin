const jwt = require('jsonwebtoken');
const { logger } = require('../logger/logger');

const failed = 'ForbiddenActionForUser';

const inRoles = (roles, arg) => {
    const rolesLowered = roles.map(e => e.toLowerCase());
    return rolesLowered.includes(arg);
}

const isRole = (role, arg) => {
    return role.toLowerCase() === arg.toLowerCase();
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
 * @param {*} roles , an array of string or a single, string can be in UPPERCASE or lowercase
 */
const role = (roles = null) => {

    if(roles == null){
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
                if(('role' in decoded) == false){
                    return res.jsonp({ status: false, auth: false, message: failed });
                }

                let foo = false;
                if(f_type(roles) == 'string')   foo = isRole(roles, decoded.role);
                if(f_type(roles) == 'array')    foo = inRoles(roles, decoded.role); 

                if(foo == false){
                    return res.jsonp({ status: false, auth: false, message: failed });
                }

                if(('_id' in req) == false) req._id = decoded._id;
                req.user = {
                    '_id': decoded._id,
                    'role': decoded.role
                };
                next();
            }
            catch(e){
                logger.error(e);
                return res.jsonp({ status: false, auth: false, message: failed});
            }
        }
    }
}

module.exports.role = role;
