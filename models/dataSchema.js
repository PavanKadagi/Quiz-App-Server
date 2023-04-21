const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
        trim:true
    },
    option1:{
        type:String,
        required:true,
        trim:true
    },
    option2:{
        type:String,
        required:true,
        trim:true
    },
    option3:{
        type:String,
        required:true,
        trim:true
    },
    option4:{
        type:String,
        required:true,
        trim:true
    },
    answer:{
        type:String,
        required:true,
        trim:true
    }
});
// mongoDB will add "s" or "es" end of string for example:htmles
mongoose.pluralize(null);
const Html = new mongoose.model('html',dataSchema);
const Css = new mongoose.model('css',dataSchema);
const Js = new mongoose.model('javascript',dataSchema);
const Express = new mongoose.model('express',dataSchema);
const Mongodb = new mongoose.model('mongodb',dataSchema);
const React = new mongoose.model('react',dataSchema);



module.exports = {Html,Css,Js,Express,Mongodb,React}