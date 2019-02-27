const joi = require('joi');
const boom = require('boom');

function validate(data, schema) {
    const { error } = joi.validate(data, schema)
    return error;
}

function validationHandler(schema, check = "body"){
    return (req, res, next)=>{
        const error = validate(req[check], schema);
        if (error){
            next(boom.badRequest(error));
        }else{
            next();
        }
    }
}

module.exports = validationHandler;