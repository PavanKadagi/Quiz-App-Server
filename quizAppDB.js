require('dotenv').config();
require('./database/connection');
const {Html,Css,Js,Express,Mongodb,React} = require('./models/dataSchema');
const HtmlJsonData = require('./data/html.json');
const CssJsonData = require('./data/css.json');
const JavaScriptData = require('./data/javascript.json')
const expressData = require('./data/express.json')
const mongodbData = require('./data/mongodb.json')
const reactData = require('./data/react.json')


const start = async()=>{
    try {
        await Html.deleteMany();
        await Html.create(HtmlJsonData);
        await Css.deleteMany();
        await Css.create(CssJsonData)
        await Js.deleteMany();
        await Js.create(JavaScriptData);
        await Express.deleteMany()
        await Express.create(expressData)
        await Mongodb.deleteMany()
        await Mongodb.create(mongodbData)
        await React.deleteMany()
        await React.create(reactData)
        console.log('success');
    } catch (error) {
        console.log('HTML',error.message);
    }
}


start();

