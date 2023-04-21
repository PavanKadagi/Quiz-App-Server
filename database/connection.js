const mongoose = require('mongoose');


mongoose.connect(process.env.DB_HOST,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log('connection successfull !');
}).catch((err)=>console.log('No connection '+err));

