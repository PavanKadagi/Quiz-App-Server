const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        // validator.isE
    },
    phone:{
        type:Number,
        required:true,
        // max:10,
        // min:10
    },
    profession:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    dob:{
        type:String,
        required:true   
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
   myFile:{
    type:String
   },
    date:{
        type:Date,
        default:new Date()
    },
    messages:[
        {
            name:{
                type:String,
                required:true,
                trim:true
            },
            email:{
                type:String,
                required:true,
                trim:true,
                // unique:true,
            },
            phone:{
                type:Number,
                required:true,
            },
            message:{
                type:String,
                required:true,
                trim:true
            }
        }
    ],
    answers:[
        {
            answer:{
                type:Number,
                required:true
            },
            language:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                default:new Date()
            },
            totalMarks:{
                type:Number,
                default:10.00
            },
            timeTaken:{
                type:String,
                // required:true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
        required:true
            }
        }
    ],
    is_admin:{
        type:Boolean,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    token:{
       type:String,
       default:'' 
    }
},
{timestamps:true}
);

// we are generating token
userSchema.methods.generatingToken = async function(){
    try {
        const token =  jwt.sign({_id:this._id},process.env.SECRETE_KEY)
        this.tokens = this.tokens.concat({token:token});
        await this.save();
    return token;
    } catch (error) {
        console.log(error)
    }
}


// sending message for contact page
userSchema.methods.addMessage = async function  (name,email,phone,message){
    try {
    this.messages = this.messages.concat({name,email,phone,message});
    await this.save();
    return this.messages;
    } catch (error) {
        console.log('send message',error);
    }
}

// uploading answer for particular user
userSchema.methods.addAnswerToUser = async function (answer,language,timeTaken){
    try {
        this.answers = this.answers.concat({answer,language,timeTaken});
        await this.save();
        return this.answers;
    } catch (error) {
        console.log('answer upload',error)
    }
}

// uploading imgae for About page
userSchema.methods.uploadImage = async function  (myFile){
    try {
        this.image = this.image.concat({myFile});
    await this.save();
    return this.image;
    } catch (error) {
        console.log('Upload imgae',error);
    }
}

// console.log('id',this._id);



userSchema.pre('save', async function (next){
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10);
    // return this.password;
    }
    next()
})

module.exports = new mongoose.model('Users',userSchema);






