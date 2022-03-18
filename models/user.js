const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportlocalmongoose=require('passport-local-mongoose');

var User=new Schema({
    /*username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },*/
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,
        default:false
    }
});
User.plugin(passportlocalmongoose);
module.exports=mongoose.model('User',User);