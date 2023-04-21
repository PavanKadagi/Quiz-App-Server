require('dotenv').config();
require('./database/connection')
const express = require('express');
const app= express();
const cors = require('cors');
// const User = require('./models/userSchema');
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
// const bodyparser = require('body-parser');
const admin = require('./router/admin');


// app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(cookieParser());
// we link the router files to make our route easy
app.use("/admin",admin);
app.use(require('./router/user'))
app.use(require('./router/data'))


app.listen(port,()=>{
    console.log(`Server is runing at port ${port}`)
});
