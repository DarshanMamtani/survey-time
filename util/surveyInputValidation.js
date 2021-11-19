const Joi = require('joi');
//validation

const surveyValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        questions: Joi.array().min(1).required()
    });
    return schema.validate(data);
}

module.exports = surveyValidation;