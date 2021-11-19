const Joi = require('joi');
//validation

const userValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(4).required()
    });
    return schema.validate(data);
}

module.exports = userValidation;