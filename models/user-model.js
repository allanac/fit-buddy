const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
    name:{type:String},
    email: {type: String, required: true},
    encryptedPassword: {type:String},
    facbookID: {type: String},
    googleID: {type:String},

    gender: {type:String, enum:['male', 'female']},
    userLocation:{type: String},

    userGym:{type: Array},
    workoutLocations:{type:Array},
    workoutTypes:{type: Array},
    userBuddyPref:{type:String, enum:['male', 'female']},

    userFitLevel:{type: String},
    userFitGoals:{type: String},
    bodyType:{type:String},

    availableDays: {type:Array},
    availableTimes: {type:Array}

  },
    {timestamps:true}

);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
