require('dotenv').config();
require('./database/connection')
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const session  = require('express-session')
const admin = require('./router/admin');
const app= express();


// app.use(session({secret:process.env.SESSION}))
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(cors({
   origin:["http://localhost:3000","https://online-quiz-2qyq.onrender.com",],
   optionsSuccessStatus: 200,
   credentials:true,
   methods:["GET","PUT","PATCH","POST","DELETE","OPTIONS"],
   allowedHeaders:[
    'Access-Control-Allow-Origin',
    'Content-Type',
    'Authorization',
   ],
}))
// app.use(express.urlencoded({extended:false}))
// app.use(cors({
//     origin:["http://localhost:3000","https://mern-quiz-app-9mec.onrender.com/"],
    // credentials:true
// }));


// we link the router files to make our route easy

app.use(require('./router/user'))
app.use("/admin",admin);
app.use(require('./router/data'))


app.listen(port,()=>{
    console.log(`Server is runing at port ${port}`)
});
