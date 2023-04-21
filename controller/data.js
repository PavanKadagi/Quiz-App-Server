require("../database/connection");
const { Html,Css,Js,Express,Mongodb ,React} = require("../models/dataSchema");

const getQuizData = async (req, res) => {
  try {
    let { language } = req.params;
    let  language2 = req.query;
    console.log(language,"----"+language2.page)
    let indexOfAnd = language.indexOf("&");
    let indexOfEqual = language.indexOf("=");
    let page = language.slice(indexOfEqual + 1, indexOfAnd);

    language = language.slice(0, indexOfAnd-4) || language;
    let data;
    const limit = req.query.limit || 1;
    const skip = (page - 1) * limit;
    console.log("language", language);

    switch (language) {
      case "html":
        data = await Html.find({}).skip(skip).limit(limit);
        res.status(200).json({ data, length: data.length });
        break;
      case "css":
        data = await Css.find({}).skip(skip).limit(limit);
        res.status(200).json({ data, length: data.length });
        break;
        case "javascript":
        data = await Js.find({}).skip(skip).limit(limit);
        res.status(200).json({ data, length: data.length });
        break;
        case "express":
        data = await Express.find({}).skip(skip).limit(limit);
        res.status(200).json({ data, length: data.length });
        break;
        case "mongodb":
        data = await Mongodb.find({}).skip(skip).limit(limit);
        res.status(200).json({ data, length: data.length });
        break;
        case "react":
        data = await React.find({}).skip(skip).limit(limit);
        res.status(200).json({ data, length: data.length });
        break;
      default:
        res.status(200).json({ msg: "No result" });
        break;
    }
  } catch (error) {
    console.log("getQuizData", error);
  }
};




module.exports = { getQuizData};
