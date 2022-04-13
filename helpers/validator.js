const validator = {

    isString: function(a) {
        if(a == null) return false;
        return typeof a === 'string';
    },

    isMail: function(a){
        if(a == null) return false;
        const regex = new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/);
        return regex.test(a);
    },

    isDate: function(a){
        if(a == null) return false;
        const regexDash = new RegExp(/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/);
        const regexSlash = new RegExp(/(?:19|20)[0-9]{2}}\/(?:(?:0[1-9]|1[0-2])\/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])\/(?:30))|(?:(?:0[13578]|1[02])-31))/);
		return regexDash.test(a) || regexSlash.test(a);
    },

    isTime: function(a){
        if(a == null) return false;
        const regex = new RegExp(/(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])/);
        return regex.test(a);
    },

    isJSON: function(a){
        if(a == null) return false;
        if (typeof a!=="string"){
            return false;
        }
        try {
            var o = JSON.parse(a);
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) { return false; }        
    },

    isAlphaNum: function(a){
        if(a == null) return false;
        const regex = new RegExp(/^[a-zA-Z0-9]+$/);
        return regex.test(a);
    },

    isNumber: function(a){
        if(a == null) return false;
        if(typeof a == 'number') return true;
        if(typeof a == 'string') return !isNaN(a);
    },

    isPhoneNumber: function(a = null){
        if(a == null) return false;
        const regex = new RegExp(/^\+[0-9]{8,}$/, 'g');
        return regex.test(a);
    }
}

module.exports.validator = validator;
