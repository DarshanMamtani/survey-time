const router = require('express').Router();
const tokenValidation = require('../util/tokenValidation');
const { createSurvey, viewSurvey, takeSurvey, viewResults } = require('../controllers/survey.controller');

// Create Survey
router.post('/create', tokenValidation, createSurvey);

// View Survey
router.get('/view/:id', tokenValidation, viewSurvey);

// Take Survey
router.post('/take', tokenValidation, takeSurvey);

// Get Results
router.get('/results/:id', tokenValidation, viewResults);

module.exports = router;