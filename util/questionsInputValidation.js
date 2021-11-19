const Joi = require('joi');
//validation

const questionsValidation = (data) => {
    const schema = Joi.object({
        surveyid: Joi.number().required(),
        questions: Joi.array().min(1).required().items({
            id: Joi.number().required(),
            answer: Joi.string().required()
        })
    });
    return schema.validate(data);
}

module.exports = questionsValidation;