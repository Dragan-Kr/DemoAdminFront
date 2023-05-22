const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,'Please provide userName'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true
        
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6
      
    },
     role:{
        type:String
      }


});
UserSchema.pre('save',async function(){
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt);

});

// UserSchema.methods.getName = function(){
// return this.name;
// };

UserSchema.methods.createJWT = function(){
return jwt.sign({userId:this._id,userName:this.userName},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
};


UserSchema.methods.comparePassword = async function (canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword,this.password);
    return isMatch;
};
module.exports = mongoose.model('User',UserSchema);