const surveyValidation = require('../util/surveyInputValidation');
const questionsValidation = require('../util/questionsInputValidation');

// Models
const Survey = require('../models/Survey');
const Questions = require('../models/Questions');


// Create Survey
/** 
 * In this endpoint: 
 * Survey name and questions are coming as input in request body
 * First, I am creating the survey
 * Then, I am looping over the array of questions and creating entry in Questions table
*/
const createSurvey = async (req, res) => {
    // validating input
    const { error } = surveyValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }

    // getting user from req and surveyName & questions from request body
    const user = req.user;
    const surveyName = req.body.name;
    const questions = req.body.questions;

    try {
        // creating survey
        const survey = await Survey.create({
            userid: user.id,
            surveyName: surveyName
        });

        // for every question -> creating entry in questions table
        for (const question of questions) {
            await Questions.create({
                surveyid: survey.id,
                question: question
            });
        }

        res.status(200).send({
            message: 'Survey Created! Please remember the surveyID to view or take survey',
            surveyID: survey.id
        });
    } catch (error) {
        res.status(500).send("Internal Error!");
    }
};

/*******************************************************************************************************/

// View Survey
/** 
 * In this endpoint: 
 * I am sending all the questions (but not true and false count) with given survey ID
 * surveyID is given in URL
*/

const viewSurvey = async (req, res) => {
    // getting survey id from url
    const surveyid = req.params.id;

    // getting all question from questions table with given id
    const survey = await Questions.findAll({
        attributes: ['id', 'question'],
        where: { surveyid: surveyid }
    });

    // If question found -> return questions
    // else return error
    if (survey.length != 0) {
        res.status(200).send({
            message: "Here is the survey! Please remember Question IDs to answer the questions",
            survey: survey
        });
    } else {
        res.status(404).send({
            message: "No such survey found !",
        });
    }
};

/*******************************************************************************************************/

// Take Survey
/** 
 * In this endpoint: 
 * First I am checking if the questions given in request body match with the questions with given survey ID
 * Because, generally questions same survey should answered at a time
 * 
 * If there are more or less questions than the questions in given surveyID OR
 * Questions do not match with the questions in given surveyID :
 * then returning error
*/
const takeSurvey = async (req, res) => {
    // validating input
    const { error } = questionsValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }

    // getting surveyid and questions array from request body
    const surveyid = req.body.surveyid;
    const questions = req.body.questions;

    try {
        // fetching all questions of given survey id
        const surveyQuestions = await Questions.findAll({
            where: { surveyid: surveyid }
        })

        if (surveyQuestions.length === 0) {
            return res.status(404).send({
                message: "So Survey Found!"
            });
        }

        // Checking if all the questions of given surveyid are present in request body or not
        let questionsMatch = true;
        if (surveyQuestions.length !== questions.length) {
            questionsMatch = false;
        }
        for (const question of questions) {
            const questionExists = surveyQuestions.some(obj => obj.id === question.id);
            if (!questionExists) {
                questionsMatch = false;
            }
        }

        // if all question match with given survey ID -> update trueCount or falseCount according to answer
        // else return error
        if (questionsMatch) {
            for (const question of questions) {
                const dbQuestion = surveyQuestions.find(ques => ques.id === question.id);

                if (question.answer === 'true') {
                    const prevTrueCount = dbQuestion.trueCount;
                    dbQuestion.trueCount = prevTrueCount + 1;
                } else {
                    const prevFalseCount = dbQuestion.falseCount;
                    dbQuestion.falseCount = prevFalseCount + 1;
                }
                await dbQuestion.save();
            }

            res.status(200).send({
                message: "Survey Submitted Successfully!"
            });

        } else {
            res.status(400).send({
                error: "Either not all questions of Survey ID are given or Question from different Survey ID is given.",
                message: "Please the enter all the questions of survey ID that you mentioned!"
            });
        }
    } catch (error) {
        res.status(500).send("Internal Error!")
    }

};

/*******************************************************************************************************/

// Get Results
/** 
 * In this endpoint: 
 * I am sending all the questions with given survey ID
 * surveyID is given in URL
*/
const viewResults = async (req, res) => {
    const surveyid = req.params.id;

    // getting all question from questions table with given id
    const survey = await Questions.findAll({
        where: { surveyid: surveyid }
    });

    // If question found -> return questions
    // else return error
    if (survey.length != 0) {
        res.status(200).send({
            message: "Here are the survey results!",
            survey: survey
        });
    } else {
        res.status(404).send({
            message: "No such survey found!",
        });
    }
};

module.exports = {
    createSurvey,
    viewSurvey,
    takeSurvey,
    viewResults
};