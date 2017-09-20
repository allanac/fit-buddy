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
    location:{type: String},

    gym_membership:{type: Array},
    pref_workout_loc:{type:Array},
    pref_workout_buddy:{type:String, enum:['male', 'female']},

    fitness_level:{type: String},
    fitness_goals:{type: String},
    body_type:{type:String},

    availability_days: {type:Array},
    availability_time: {type:Array}

  },
    {timestamps:true}

);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
