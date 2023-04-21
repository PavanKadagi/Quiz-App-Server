const express = require("express");
const admin = express.Router();
const bodyparser = require('body-parser');
const bcrypt = require("bcrypt");

admin.use(bodyparser.json());
admin.use(bodyparser.urlencoded({extended:true}));

const adminAuthenticate = require('../middleware/adminAuthenticate')
const {adminLogin,adminLogout,adminDashboard} = require('../controller/admin');


admin.route('/').post(adminLogin)
admin.route('/home').get(adminAuthenticate,adminDashboard)
admin.route('/logout').get(adminAuthenticate,adminLogout)



module.exports = admin;