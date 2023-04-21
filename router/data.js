const express = require('express');
const router = express.Router();
const {getQuizData} = require('../controller/data');
const authenticate = require('../middleware/authenticate');



router.route('/test/:language').get(authenticate,getQuizData);

module.exports=router;